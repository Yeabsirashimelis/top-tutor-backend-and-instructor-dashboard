import { betterFetch } from "@better-fetch/fetch";
import { Product, ProductCategory } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { string } from "zod";

// query functions
const getOrdersStatistics = async () => {
  const res = await betterFetch<Product[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/statistics`
  );
  return res.data;
};

export const useGetOrdersStatistics = () => {
  return useQuery({
    queryKey: ["orderStatistics"],
    queryFn: () => getOrdersStatistics(),
  });
};

const getProductRelatedStatistics = async () => {
  const res = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product-categories/product-related-statistics`
  );
  return res.data;
};

export const useGetProductRelatedStatistics = () => {
  return useQuery({
    queryKey: ["productRelatedStatistics"],
    queryFn: () => getProductRelatedStatistics(),
  });
};

const getOrderByMonthStatistics = async () => {
  const res = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/statistics/by-month`
  );
  return res.data;
};

export const useGetOrderByMonthStatistics = () => {
  return useQuery({
    queryKey: ["orderByMonth"],
    queryFn: () => getOrderByMonthStatistics(),
  });
};

const getOrderByStatusStatistics = async () => {
  const res = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/statistics/by-status`
  );
  return res.data;
};

export const useGetOrderStatusStatistics = () => {
  return useQuery({
    queryKey: ["orderByStatus"],
    queryFn: () => getOrderByStatusStatistics(),
  });
};

const getOrderPerCategories = async () => {
  const res = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/statistics/in-each-category`
  );
  return res.data;
};

export const useGetOrderPerCategories = () => {
  return useQuery({
    queryKey: ["orderByCategory"],
    queryFn: () => getOrderPerCategories(),
  });
};

const getOrderPerSubcategories = async () => {
  const res = await betterFetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/statistics/in-each-subcategory`
  );
  return res.data;
};

export const useGetOrderPerSubcategories = () => {
  return useQuery({
    queryKey: ["orderBySubcategory"],
    queryFn: () => getOrderPerSubcategories(),
  });
};
