export const mapFormatter = {
    formatStatus(value) {
        return parseInt(value) === 0 ? '禁用' : '正常';
    }
};
