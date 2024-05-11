import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import './style.css';

import { ReactComponent as PlusIcon } from '../../assets/icons/plus.svg';
import { ReactComponent as ConnectedIcon } from '../../assets/icons/connected.svg';
import { ReactComponent as DisconnectedIcon } from '../../assets/icons/disconnected.svg';
import { ReactComponent as TrashIcon } from '../../assets/icons/trash.svg';
import { ReactComponent as ExportIcon } from '../../assets/icons/import.svg';
import { ReactComponent as ImportIcon } from '../../assets/icons/export.svg';

import { usePopup } from '../../core/Popup/PopupProvider';
import { AppLayout } from '../../core/AppLayout';
import { api } from '../../api';
import { SetupForm } from '../../forms/SetupForm/SetupForm';
import { Confirm } from '../../forms/Confirm/Confirm';

interface IconButtonProps {
    onClick?: VoidFunction;
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const IconButton: React.FC<IconButtonProps> = ({
    onClick,
    Icon,
}) => {
    return (
        <div className="icon-button__container" onClick={onClick}>
            <Icon />
        </div>
    );
};

interface SetupActionsProps {
    setup: API.Setup;
}

const SetupActions: React.FC<SetupActionsProps> = ({ setup: { id, name } }) => {
    const queryClient = useQueryClient();
    const { setPopupComponent } = usePopup();

    const { mutate: deleteRemoteSetup } = useMutation({
        mutationFn() {
            return api.fetch(`/setups/${id}`, {
                method: 'DELETE',
            });
        },

        onSuccess() {
            queryClient.setQueryData<API.Setup[]>(
                ['setups'],
                (setups) => setups ? setups.filter(setup => setup.id !== id) : [],
            );
        },
    });

    const { mutateAsync: exportRemoteSetup } = useMutation<string>({
        mutationFn() {
            return api.fetch(`/setups/${id}/export`);
        },
    });

    const { mutateAsync: importRemoteSetup } = useMutation<void, Error, File>({
        mutationFn(file) {
            return file.arrayBuffer().then(buffer => api.fetch(`/setups/${id}/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/yaml',
                },
                body: buffer,
            }));
        },
    });

    const onDeleteClick = () => {
        setPopupComponent(
            <Confirm
                title={`Вы действительно хотите удалить ${name}?`}
                acceptText='Да'
                rejectText='Отмена'
                onAccept={() => {
                    deleteRemoteSetup();
                    setPopupComponent(null);
                }}
                onReject={() => setPopupComponent(null)}
            />,
        );
    };

    const onImportClick = () => {
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'file');
        inputElement.setAttribute('accept', '.yaml');
        inputElement.onchange = () => {
            if (!inputElement.files || !inputElement.files[0]) {
                return;
            }

            const file = inputElement.files[0];
            importRemoteSetup(file);
        };

        inputElement.click();
    };

    const onExportClick = () => {
        exportRemoteSetup().then(file => {
            const blob = new Blob([file]);
            const aElement = document.createElement('a');
            aElement.setAttribute('download', name + '.yaml');
            const href = URL.createObjectURL(blob);
            aElement.href = href;
            aElement.setAttribute('target', '_blank');
            aElement.click();
            URL.revokeObjectURL(href);
        });
    };

    return (
        <div className='setup-actions-row'>
            <IconButton Icon={TrashIcon} onClick={onDeleteClick} />
            <IconButton Icon={ImportIcon} onClick={onImportClick} />
            <IconButton Icon={ExportIcon} onClick={onExportClick} />
        </div>
    );
};

const useSetupRemoteData = () => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['setups'],

        queryFn() {
            return api.fetch<API.Setup[]>('/setups');
        },
    });

    const { mutate: createRemoteSetup } = useMutation<API.Setup, unknown, POST.Setup>({
        mutationFn(setup) {
            return api.fetch('/setups', {
                method: 'POST',
                body: setup,
            });
        },

        onSuccess(setup) {
            queryClient.setQueryData<API.Setup[]>(['setups'], (setups) => setups ? [...setups, setup] : [setup]);
        },
    });

    const { mutate: patchRemoteSetup } = useMutation<API.Setup, unknown, {
        id: number,
        setup: PATCH.Setup
    }>({
        mutationFn({ id, setup }) {
            return api.fetch(`/setups/${id}`, {
                method: 'PATCH',
                body: setup,
            });
        },

        onSuccess(setup) {
            queryClient.setQueryData<API.Setup[]>(
                ['setups'],
                (setups) => setups ? setups.map(setup => setup.id === setup.id ? setup : setup) : [setup],
            );
        },
    });

    const { mutate: toggleRemoteSetup } = useMutation<API.Setup, unknown, Pick<API.Setup, 'id' | 'is_active'>>({
        mutationFn(setup) {
            const action = setup.is_active ? 'deactivate' : 'activate';

            return api.fetch(`/setups/${setup.id}/${action}`, {
                method: 'POST',
            });
        },

        onMutate(setup) {
            queryClient.setQueryData<API.Setup[]>(
                ['setups'],
                (setups) => setups ? setups.map(item => {
                    if (item.id !== setup.id) {
                        return item;
                    }

                    return {
                        ...item,
                        is_active: !setup.is_active,
                    };
                }) : [],
            );
        },

        onError(error, setup) {
            queryClient.setQueryData<API.Setup[]>(
                ['setups'],
                (setups) => setups ? setups.map(item => {
                    if (item.id !== setup.id) {
                        return item;
                    }

                    return {
                        ...item,
                        is_active: setup.is_active,
                    };
                }) : [],
            );
        },
    });

    return {
        setups: data || [],
        createRemoteSetup,
        patchRemoteSetup,
        toggleRemoteSetup,
    };
};

const useSetupMenuItems = () => {
    const pageParams = useParams<{ id?: string }>();
    const {
        setups,
        createRemoteSetup,
        patchRemoteSetup,
        toggleRemoteSetup,
    } = useSetupRemoteData();
    const navigate = useNavigate();

    const [selectedSetupId, setSelectedSetupId] = React.useState<number | undefined>(
        pageParams.id === undefined ? undefined : +pageParams.id,
    );

    const { setPopupComponent } = usePopup();

    const menuItems = [
        ...setups.map((item, index) => {
            const Icon = item.is_active ? ConnectedIcon : DisconnectedIcon;
            return {
                key: item.id,
                text: item.name,
                icon: <Icon onClick={(event) => {
                    event.stopPropagation();
                    toggleRemoteSetup(item);
                }} />,
                editable: true,
                onClick: () => {
                    const setupId = setups[index].id;
                    setSelectedSetupId(setupId);

                    navigate(`setup/${setupId}/agents`);
                },
                onSave: (name: string) => {
                    patchRemoteSetup({
                        id: item.id,
                        setup: {
                            name,
                        },
                    });
                },
            };
        }),
        {
            key: 'plus_button',
            icon: <PlusIcon />,
            onClick: () => setPopupComponent(
                <SetupForm
                    title='Новый сетап'
                    onCancel={() => setPopupComponent(null)}
                    onSubmit={(setup) => {
                        createRemoteSetup(setup);
                        setPopupComponent(null);
                    }}
                />,
            ),
        },
    ];

    const header = React.useMemo(() => {
        const setup = setups.find(setup => setup.id === selectedSetupId);

        if (!setup) {
            return {
                text: '',
            };
        }

        return {
            text: setup.name,
            children: (
                <SetupActions setup={setup} />
            ),
        };

    }, [selectedSetupId, setups]);

    return {
        menuItems,
        header,
    };
};

export const SetupsPage: React.FC = () => {
    const { menuItems, header } = useSetupMenuItems();
    return (
        <AppLayout
            menuItems={menuItems}
            header={header}
        />
    );
};
