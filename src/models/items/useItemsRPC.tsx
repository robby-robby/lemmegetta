import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type ItemType } from "~/models/items";
import { type SaveStatusType } from "~/components/SaveModal";
import { TRPCStatus } from "~/utils/TRPCStatus";

export function useItemsRPC(onStatusChange: (status: SaveStatusType) => void) {
  const [items, setItems] = useState<ItemType[]>([]);
  const itemsQuery = api.menuItems.getAll.useQuery();
  const itemsMuCreate = api.menuItems.create.useMutation();
  const itemsMuUpdate = api.menuItems.update.useMutation();
  const itemsMuDelete = api.menuItems.delete.useMutation();

  useEffect(() => {
    if (itemsQuery.status === TRPCStatus.success) {
      setItems(itemsQuery.data);
    }
  }, [itemsQuery.data, itemsQuery.status]);

  useEffect(() => {
    if (
      itemsMuCreate.status === TRPCStatus.success ||
      itemsMuUpdate.status === TRPCStatus.success ||
      itemsMuDelete.status === TRPCStatus.success
    ) {
      void itemsQuery.refetch();
    }
  }, [itemsMuCreate.status, itemsMuUpdate.status, itemsMuDelete.status]);

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
