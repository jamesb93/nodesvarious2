import * as RNBO from "@rnbo/js"

export const createDeviceInstance = (
    devicePath: string,
    context: AudioContext,
    output: AudioNode
): Promise<RNBO.Device> => {
    return new Promise((resolve, reject) => {
        fetch(devicePath)
            .then((response) => response.json())
            .then((response) => {
                const patcher = response;
                return RNBO.createDevice({ context, patcher });
            })
            .then((device) => {
                device.node.connect(output);
                device.messageEvent.subscribe((e: RNBO.MessageEvent) => {
                    if (e.tag.includes('debug')) {
                        console.log(e.tag, e.payload);
                    }
                });
                if (device) {
                    resolve(device);
                } else {
                    reject('Error');
                }
            });
    });
};