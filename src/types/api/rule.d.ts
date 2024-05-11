declare namespace API {
    interface Rule {
        id: number;
        setup_id: number;
        agent_rule_id: string;
        name: string;
        description?: string;
        manipulator_id: number;
        signal_code: string;
        executor_id: number;
        command_code: string;

        /** JsonLogic */
        logic: any;
        /** JsonLogic */
        trigger: any;
    }
}

declare namespace POST {
    interface Rule {
        name: string;
        description?: string;
        manipulator_id: number;
        signal_code: string;
        executor_id: number;
        command_code: string;

        /** JsonLogic */
        logic: any;
        /** JsonLogic */
        trigger: any;
    }
}

declare namespace PATCH {
    interface Rule extends Partial<POST.Rule> { }
}
