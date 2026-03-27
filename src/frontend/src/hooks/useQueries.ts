import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ApplicationInput,
  ApplicationStatus,
  GuestApplication,
} from "../backend.d";
import { useActor } from "./useActor";

export function useSubmitApplication() {
  const { actor } = useActor();
  return useMutation<string, Error, ApplicationInput>({
    mutationFn: async (input: ApplicationInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitApplication(input);
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<GuestApplication[]>({
    queryKey: ["allApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; status: ApplicationStatus }>({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateApplicationStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
    },
  });
}
