import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type ItemType } from "~/models/items";
import { SaveState, type SaveStatusType } from "~/components/SaveModal";
import { TRPCStatus } from "~/utils/TRPCStatus";
// import { sta} from '@trpc/server';

export type ItemsRPCAction = "create" | "update" | "delete";

export function useItemsRPC(
  onStatusChange: (
    status: SaveStatusType,
    action: ItemsRPCAction
  ) => void | ((status: SaveStatusType) => void)
) {
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
    if (itemsMuCreate.status !== TRPCStatus.idle) {
      onStatusChange(itemsMuCreate.status, "create");
    }
    if (itemsMuCreate.status === TRPCStatus.success) {
      void itemsQuery.refetch();
    }
  }, [itemsMuCreate.status]);

  useEffect(() => {
    if (itemsMuUpdate.status !== TRPCStatus.idle) {
      onStatusChange(itemsMuUpdate.status, "update");
    }
    if (itemsMuUpdate.status === TRPCStatus.success) {
      void itemsQuery.refetch();
    }
  }, [itemsMuUpdate.status]);

  useEffect(() => {
    if (itemsMuDelete.status !== TRPCStatus.idle) {
      onStatusChange(itemsMuDelete.status, "delete");
    }
    if (itemsMuDelete.status === TRPCStatus.success) {
      void itemsQuery.refetch();
    }
  }, [itemsMuDelete.status]);

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
  const removeAsync = (itemId: ItemType["id"]) => {
    return itemsMuDelete.mutateAsync({ id: itemId });
  };

  return {
    items,
    createAsync,
    updateAsync,
    removeAsync,
    create,
    remove,
    update,
    refetch: itemsQuery.refetch,
    itemsMuCreate,
    itemsMuUpdate,
    itemsMuDelete,
    itemsQuery,
  };
}
