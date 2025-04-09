import { useQuery } from "@tanstack/react-query";
import { listsService } from "../lists-service";

export const KEY = ["lists"];

export const useGetLists = () => {
  return useQuery({
    queryKey: KEY,
    queryFn: () => listsService.getLists(),
    refetchInterval: 5000,
  });
};
