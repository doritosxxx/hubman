import { api } from '../../../api';
import { useQuery } from '@tanstack/react-query';

export const useRemoteSetupRules = (setupId: number) => {
    const { data: rules, isFetching } = useQuery({
        queryKey: ['setups', setupId, 'rules'],
        queryFn: () => api.fetch<API.Rule[]>(`/setups/${setupId}/rules`),
    });

    return {
        rules,
        isFetching,
    };
};
