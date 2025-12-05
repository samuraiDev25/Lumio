import { Typography } from '@/shared/ui/typography/Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'large',
        'h1',
        'h2',
        'h3',
        'regular_text_16',
        'bold_text_16',
        'regular_text_14',
        'medium_text_14',
        'bold_text_14',
        'small_text',
        'semi_bold_small_text',
      ],
    },
    as: { control: 'text' },
    children: { control: 'text' },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'danger'],
    },
    isLink: { control: 'boolean' },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'grid', gap: 30, fontSize: '14px', color: 'yellow' }}
    >
      Компонет Typography: <br /> - as принимает какой элемент вернет компонент;
      по умолчанию &lt;p/&gt; <br /> - variant отвечает за font-size,
      line-height, font-weight; <br /> -isLink для ссылки, так же обязательно
      передать as={'a'}
      <div>
        LARGE :
        <Typography variant="large">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        H1:
        <Typography as={'h1'} variant="h1">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        H2:
        <Typography as={'h2'} variant="h2">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        H3:
        <Typography as={'h3'} variant="h3">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      ------------------------------------------------------------------------------------------------------------------
      <div>
        regular_text 16 (без пропсов, по умолчанию &lt;p/&gt;):
        <Typography>
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        regular_text 16 ( as=span; color=secondary):
        <br />
        <Typography as={'span'} variant="regular_text_16" color="secondary">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        regular_text 16 ( as=span; color=danger ):
        <br />
        <Typography as={'span'} color="danger">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      ------------------------------------------------------------------------------------------------------------------
      <div>
        bold_text 16:
        <Typography variant="bold_text_16">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        regular_text 14:
        <Typography variant="regular_text_14">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        medium_text 14:
        <Typography variant="medium_text_14">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        bold_text 14:
        <Typography variant="bold_text_14">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        small_text:
        <Typography variant="small_text">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        semi-bold small_text:
        <Typography variant="semi_bold_small_text">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        regular_link:
        <Typography as={'a'} isLink href={'#'} variant="regular_text_14">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        small_link:
        <Typography as={'a'} isLink href={'#'} variant="small_text">
          Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH
        </Typography>
      </div>
      <div>
        пример использования в button: <br /> (используется variant={'h3'}
        согласно макету ) <br />
        <button
          style={{
            border: '1px solid var(--color-text-accent)',
            backgroundColor: ' var(--color-text-accent)',
            borderRadius: '5px',
            padding: '10px 25px',
            margin: '20px 0',
          }}
        >
          <Typography as="span" variant={'h3'}>
            Button
          </Typography>
        </button>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'large',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
    as: 'p',
    color: 'primary',
    isLink: false,
  },
};

export const Large: Story = {
  args: {
    variant: 'large',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const H1: Story = {
  args: {
    variant: 'h1',
    as: 'h1',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const H2: Story = {
  args: {
    variant: 'h2',
    as: 'h2',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const H3: Story = {
  args: {
    variant: 'h3',
    as: 'h3',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const RegularText16: Story = {
  args: {
    variant: 'regular_text_16',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const BoldText16: Story = {
  args: {
    variant: 'bold_text_16',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const RegularText14: Story = {
  args: {
    variant: 'regular_text_14',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const MediumText14: Story = {
  args: {
    variant: 'medium_text_14',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const BoldText14: Story = {
  args: {
    variant: 'bold_text_14',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const SmallText: Story = {
  args: {
    variant: 'small_text',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const SemiBoldSmallText: Story = {
  args: {
    variant: 'semi_bold_small_text',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

/* ===================== COLORS ===================== */

export const SecondarySpan: Story = {
  args: {
    variant: 'regular_text_16',
    as: 'span',
    color: 'secondary',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

export const DangerSpan: Story = {
  args: {
    as: 'span',
    color: 'danger',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
  },
};

/* ===================== LINKS ===================== */

export const RegularLink: Story = {
  args: {
    as: 'a',
    isLink: true,
    variant: 'regular_text_14',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
    href: '#',
  },
};

export const SmallLink: Story = {
  args: {
    as: 'a',
    isLink: true,
    variant: 'small_text',
    children:
      'Carosserie Test Zürich Stauffacherstrasse 31 8004 Zürich, ZH, CH',
    href: '#',
  },
};

/* ===================== BUTTON EXAMPLE ===================== */

export const UsedInButton: Story = {
  render: () => (
    <button
      style={{
        border: '1px solid var(--color-text-accent)',
        backgroundColor: 'var(--color-text-accent)',
        borderRadius: '5px',
        padding: '10px 25px',
        margin: '20px 0',
      }}
    >
      <Typography as="span" variant="h3">
        Button
      </Typography>
    </button>
  ),
};
