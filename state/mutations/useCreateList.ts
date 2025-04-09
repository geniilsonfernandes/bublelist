import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listsService } from "../lists-service";
import { KEY as LISTS_KEY } from "../queries/useGetLists";

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: listsService.saveList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LISTS_KEY,
      });
    },
  });
};


