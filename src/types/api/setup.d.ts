declare namespace API {
    interface Setup {
        id: number;
        name: string;
        is_active: boolean;
    }
}

declare namespace POST {
    interface Setup {
        name: string;
    }
}

declare namespace PATCH {
    interface Setup {
        name?: string;
    }
}
