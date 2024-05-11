export const isManipulator = (device: API.Device): device is API.Manipulator => {
    return device.is_manipulator && !device.is_executor;
};

export const isExecutor = (device: API.Device): device is API.Executor => {
    return device.is_executor && !device.is_manipulator;
};

export const isHermaphrodite = (device: API.Device): device is API.Hermaphrodite => {
    return device.is_executor && device.is_manipulator;
};
