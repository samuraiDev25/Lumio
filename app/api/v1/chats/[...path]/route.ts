import { NextRequest, NextResponse } from 'next/server';

type MeResponse = {
  userId: string;
};

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const CHAT_API_URL = process.env.CHAT_API_URL ?? 'https://chat.lumio.su/api/v1';

const AUTH_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ?? 'https://lumio.su/';

const getResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';

  return contentType.includes('application/json')
    ? response.json()
    : response.text();
};

const createErrorResponse = (message: string, field: string, status: number) =>
  NextResponse.json({ errorsMessages: [{ message, field }] }, { status });
const isInternalApiError = (body: unknown) =>
  typeof body === 'object' &&
  body !== null &&
  'errorsMessages' in body &&
  Array.isArray(body.errorsMessages) &&
  body.errorsMessages.some(
    (error) =>
      typeof error === 'object' &&
      error !== null &&
      'field' in error &&
      error.field === 'internal-api',
  );

const proxyChatRequest = async (
  request: NextRequest,
  { params }: RouteContext,
) => {
  const internalApiKey = process.env.INTERNAL_API_KEY;
  const internalService = process.env.INTERNAL_SERVICE_NAME;
  const authorization = request.headers.get('authorization');

  if (!internalApiKey || !internalService) {
    return createErrorResponse(
      'Chat proxy environment is not configured',
      'internal-api',
      500,
    );
  }

  if (!authorization) {
    return createErrorResponse(
      'Authorization header is missing',
      'authorization',
      401,
    );
  }

  const meResponse = await fetch(new URL('/api/v1/auth/me', AUTH_API_URL), {
    headers: { authorization },
    cache: 'no-store',
  });

  if (!meResponse.ok) {
    return NextResponse.json(await getResponseBody(meResponse), {
      status: meResponse.status,
    });
  }

  const { userId } = (await meResponse.json()) as MeResponse;
  const actorUserId = Number(userId);

  if (!Number.isInteger(actorUserId) || actorUserId < 1) {
    return createErrorResponse(
      'Current user ID is invalid',
      'x-actor-user-id',
      401,
    );
  }

  const { path } = await params;
  const chatUrl = new URL(
    `${CHAT_API_URL}/chats/${path.map(encodeURIComponent).join('/')}`,
  );

  request.nextUrl.searchParams.forEach((value, key) => {
    chatUrl.searchParams.append(key, value);
  });

  const headers: HeadersInit = {
    accept: 'application/json',
    'x-internal-api-key': internalApiKey,
    'x-internal-service': internalService,
    'x-actor-user-id': String(actorUserId),
  };
  const requestBody =
    request.method === 'GET' ? undefined : await request.text();

  if (requestBody) {
    headers['content-type'] =
      request.headers.get('content-type') ?? 'application/json';
  }

  const chatResponse = await fetch(chatUrl, {
    method: request.method,
    headers,
    body: requestBody,
    cache: 'no-store',
  });

  const responseBody = await getResponseBody(chatResponse);
  const responseStatus =
    chatResponse.status === 401 && isInternalApiError(responseBody)
      ? 502
      : chatResponse.status;

  return NextResponse.json(responseBody, { status: responseStatus });
};

export const GET = proxyChatRequest;
export const POST = proxyChatRequest;
