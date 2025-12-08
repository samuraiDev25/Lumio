import s from './Pagination.module.scss';
import { useState } from 'react';
import { ArrowIosBack, ArrowIosForward } from '@/shared/ui/icons';

type PaginationProps = {
  totalPages: number;
  initialPage?: number;
  initialPageSize?: number;
};

const pageSizeOptions = [10, 20, 30, 50, 100];

export const Pagination = ({
  totalPages = 55,
  initialPage = 1,
  initialPageSize = 100,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  const renderPageNumbers = () => {
    const pages = [];
    pages.push(1);
    // если страниц только 7, то отобразить все
    if (totalPages <= 7) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    // до 5 показывать все страницы
    else if (currentPage <= 5) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      // завершаем точками и последней страницей
      pages.push('...');
      pages.push(totalPages);
    }
    // показывать последние 5, когда текущее число среди пяти последних
    else if (currentPage >= totalPages - 4) {
      // добавляем троеточие после первой страницы
      pages.push('...');
      // показываем последние 5 страниц
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    // текущая страница в середине
    else {
      pages.push('...');

      // добавляем 3 страницы вокруг текущей
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      // добавляем троеточие и последнюю страницу
      pages.push('...');
      pages.push(totalPages);
    }
    return pages.map((page, index) =>
      typeof page === 'number' ? (
        <button
          key={index}
          className={`${s.pageButton} ${page === currentPage ? s.active : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ) : (
        <span key={index} className={s.dots}>
          {page}
        </span>
      ),
    );
  };
  return (
    <div className={s.pagination}>
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ArrowIosBack />
      </button>
      {renderPageNumbers()}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ArrowIosForward />
      </button>
      <label className={s.label}>
        Show
        <select
          className={s.pageSizeSelect}
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size} className={s.option}>
              {size}
            </option>
          ))}
        </select>
        on page
      </label>
    </div>
  );
};
