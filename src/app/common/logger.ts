type Severity = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'ALERT';

const makeLogger = (severity: Severity) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (entry: any, meta?: Record<string, any>) => {
        if (process.env.LOG_TYPE === '0' || process.env.LOG_TYPE === undefined) {
            if (severity === 'INFO') {
                console.info(entry instanceof Error ? entry.stack : entry);
            } else if (severity === 'DEBUG') {
                console.debug(entry instanceof Error ? entry.stack : entry);
            } else if (severity === 'WARNING') {
                console.warn(entry instanceof Error ? entry.stack : entry);
            } else if (severity === 'ERROR' || severity === 'ALERT') {
                console.error(entry instanceof Error ? entry.stack : entry);
            }
        } else if (process.env.LOG_TYPE === '1') {
            console.log(
                JSON.stringify({
                    severity,
                    message: entry instanceof Error ? entry.stack : entry,
                    ...meta,
                }),
            );
        }
    };
};

export const logger = {
    debug: makeLogger('DEBUG'),
    info: makeLogger('INFO'),
    warn: makeLogger('WARNING'),
    error: makeLogger('ERROR'),
    alert: makeLogger('ALERT'),
};
