import { useState } from "react";
import { useSearchParams } from "react-router";

export interface PaginatorControl {
  page: number;
  setPage: (v: number) => void;
  updatePerPage: (v?: number) => void;
  updatePage: (v: number) => void;
  perPage: number;
  setPerPage: (v: number) => void;
  perPageOptions: number[];
}

export const usePaginator = (
  perPageOptions: number[] = [10, 25, 50, 100]
): PaginatorControl => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = searchParams.get("page");
  const [page, setPage] = useState(initialPage ? Number(initialPage) : 1);
  const initialPerPage = searchParams.get("perPage");
  const [perPage, setPerPage] = useState(
    initialPerPage ? Number(initialPerPage) : perPageOptions[0]
  );

  const updatePage = (newPage: number) => {
    setPage(newPage);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
  };

  const updatePerPage = (newPerPage?: number) => {
    if (!newPerPage) return;
    setPerPage(newPerPage);
    updatePage(1);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("perPage", newPerPage.toString());
    setSearchParams(newSearchParams);
  };

  return {
    page,
    setPage,
    updatePerPage,
    updatePage,
    perPage,
    setPerPage,
    perPageOptions,
  };
};
