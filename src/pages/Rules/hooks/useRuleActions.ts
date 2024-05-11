import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';

export const useRuleActions = (setupId: number) => {
    const queryClient = useQueryClient();

    const { mutateAsync: createRule } = useMutation<API.Rule, unknown, POST.Rule>({
        mutationFn: (rule) => api.fetch(`/setups/${setupId}/rules`, {
            method: 'POST',
            body: rule,
        }),

        onSuccess(rule) {
            queryClient.setQueryData<API.Rule[]>(
                ['setups', setupId, 'rules'],
                rules => rules ? [...rules, rule] : [],
            );
        },
    });

    const { mutateAsync: patchRule } = useMutation<API.Rule, unknown, {
        id: number;
        rule: PATCH.Rule;
    }>({
        mutationFn: ({ id, rule: rule }) => api.fetch(`/setups/${setupId}/rules/${id}`, {
            method: 'PATCH',
            body: rule,
        }),

        onSuccess(data) {
            queryClient.setQueryData<API.Rule[]>(
                ['setups', setupId, 'rules'],
                rules => rules ? rules.map((rule) => rule.id === data.id ? data : rule) : [],
            );
        },
    });

    const { mutateAsync: deleteRule } = useMutation<void, unknown, { id: number }>({
        mutationFn: ({ id }) => api.fetch(`/setups/${setupId}/rules/${id}`, {
            method: 'DELETE',
        }),

        onSuccess(data, { id }) {
            queryClient.setQueryData<API.Rule[]>(
                ['setups', setupId, 'rules'],
                rules => (rules || []).filter(rule => rule.id !== id),
            );
        },
    });


    return {
        createRule,
        patchRule,
        deleteRule,
    };
};
