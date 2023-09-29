import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type ItemType } from "~/models/items";
import { SaveStatus, type SaveStatusType } from "~/components/SaveModal";

export function useItemsRPC(
  onSuccess: (i: ItemType) => void,
  onFailure: (e: Error) => void,
  onStatusChange: (status: SaveStatusType) => void
) {
  const [items, setItems] = useState<ItemType[]>([]);
  const itemsQuery = api.menuItems.getAll.useQuery();
  const itemsMuCreate = api.menuItems.create.useMutation();
  const itemsMuUpdate = api.menuItems.update.useMutation();
  const itemsMuDelete = api.menuItems.delete.useMutation();

  useEffect(() => {
    if (itemsQuery.status === SaveStatus.success) {
      setItems(itemsQuery.data);
    }
  }, [itemsQuery.data, itemsQuery.status]);

  useEffect(() => {
    if (itemsMuCreate.status === SaveStatus.success) {
      void itemsQuery.refetch();
    }
  }, [itemsQuery.refetch, itemsMuCreate.status]);

  useEffect(() => {
    onStatusChange(itemsMuCreate.status);
  }, [itemsMuCreate.status]);

  useEffect(() => {
    onStatusChange(itemsMuUpdate.status);
  }, [itemsMuUpdate.status]);

  const create = (item: ItemType) => {
    return itemsMuCreate.mutate(item);
  };
  const update = (item: ItemType) => {
    return itemsMuUpdate.mutate(item);
  };
  const remove = (itemId: ItemType["id"]) => {
    return itemsMuDelete.mutate({ id: itemId });
  };

  const createAsync = (item: ItemType) => {
    return itemsMuCreate.mutateAsync(item);
  };
  const updateAsync = (item: ItemType) => {
    return itemsMuUpdate.mutateAsync(item);
  };

  // const createAsync = async (item: ItemType) => {
  //   try {
  //     await itemsMuCreate.mutateAsync(item);
  //     onSuccess(item);
  //   } catch (e) {
  //     onFailure(e as Error);
  //   }
  // };
  // const updateAsync = async (item: ItemType) => {
  //   try {
  //     await itemsMuUpdate.mutateAsync(item);
  //     onSuccess(item);
  //   } catch (e) {
  //     onFailure(e as Error);
  //   }
  // };
  return {
    items,
    createAsync,
    updateAsync,
    create,
    remove,
    update,
    refetch: itemsQuery.refetch,
    itemsMuCreate,
    itemsMuUpdate,
    itemsQuery,
  };
}
