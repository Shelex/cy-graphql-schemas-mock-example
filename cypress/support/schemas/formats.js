const uuid = {
    name: 'uuid',
    description: 'UUID',
    detect: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    defaultValue: 'ffffffff-ffff-ffff-ffff-ffffffffffff'
};

const timestamp = {
    name: 'timestamp',
    description: '13 digit unix timestamp',
    detect: /'^([\\d]{13})$'/,
    defaultValue: '1564139494000'
};

export const formats = {
    uuid,
    timestamp
};
