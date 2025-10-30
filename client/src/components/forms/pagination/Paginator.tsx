import { type FC, useEffect } from "react";
import { SelectInputRow } from "../SelectInput/SelectInputRow";
import { useSelectInput } from "../SelectInput/useSelectInput";

interface PaginatorProps {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  setPage: (page: number) => void;
  perPage?: number;
  perPageOptions?: number[];
  onPerPageChange: (perPage?: number) => void;
  buttonClassName?: string;
  className?: string;
}

export const Paginator: FC<PaginatorProps> = ({
  totalItems,
  currentPage,
  onPageChange,
  setPage,
  perPageOptions = [10, 25, 50, 100],
  perPage = perPageOptions[0],
  onPerPageChange,
  buttonClassName = "fs-5",
  className = "my-2",
}) => {
  const perPageControl = useSelectInput({
    initialValue: perPage,
    getKey: (o) => `${o} per page`,
    options: perPageOptions,
    required: true,
    setValueCallback: onPerPageChange,
  });

  const lastPage = Math.ceil(
    Math.max(totalItems, 1) / (perPageControl.value ?? 1)
  );

  useEffect(() => {
    if (currentPage > lastPage) {
      setPage(lastPage);
    }
  }, [currentPage, lastPage, setPage]);

  return (
    <div className={`d-flex gap-2 align-items-center ${className}`}>
      <button
        className="btn btn-secondary  bi-arrow-left"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {currentPage > 1 && (
        <button
          className={`btn ${buttonClassName} px-0`}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      )}
      <button
        className={`btn text-decoration-underline link-offset-1 ${buttonClassName} px-0`}
        onClick={() => onPageChange(currentPage)}
      >
        {currentPage}
      </button>
      {currentPage < lastPage && (
        <button
          className={`btn ${buttonClassName} px-0`}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      )}
      <button
        className="btn btn-secondary bi-arrow-right"
        disabled={currentPage >= lastPage || lastPage === 0}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <SelectInputRow control={perPageControl} label={""} className="" />
    </div>
  );
};
