type DeviceDescriptorType = 'signal' | 'command';

interface DeviceCheck {
    label: string;
    description: string;
}

declare namespace API {
    interface Device {
        id: number;
        setup_id: number;
        name: string;
        url: string;
        last_sync_time?: number;
        user_config_request_id?: string;
        rules_request_id?: string;
        bindings_request_id?: string;
        failed_checks: DeviceCheck[];

        is_manipulator: boolean;
        is_executor: boolean;
    }

    type DescribableArgType = 'String' | 'Integer' | 'Float' | 'Boolean'

    interface Describable {
        device_id: number;
        code: string;
        description: string;
        args: ReadonlyMap<string, ArgType>
    }

    interface Manipulator extends API.Device {
        is_manipulator: true;
        is_executor: false;
        signals?: Describable[];
    }

    interface Executor extends API.Device {
        is_manipulator: false;
        is_executor: true;
        commands?: Describable[];
    }

    interface Hermaphrodite extends API.Device {
        is_manipulator: true;
        is_executor: true;
        signals?: Describable[];
        commands?: Describable[];
    }

    interface ExtendedDevice extends Omit<API.Device, 'failed_check'> {
        user_config?: string;

        signals?: Describable[];
        commands?: Describable[];
    }
}

declare namespace POST {
    interface Device {
        name: string;
        url: string;
        user_config?: string;

        is_manipulator: boolean;
        is_executor: boolean;
    }
}

declare namespace PATCH {
    interface Device {
        name: string;
        url: string;
        user_config?: string;
    }
}
