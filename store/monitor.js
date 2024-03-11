import * as monitorApi from "~/common/monitoring";

export const state = () => ({
    monitorList: [],
    userMonitorList: [],
    monitorDetail: null,
    monitorSummary: null,
    monitorContent: null,
    addMonitorShow: false,
});

export const mutations = {
    setMonitorList(state, list) {
        state.monitorList = list;
    },
    setAddMonitorShow(state, bool) {
        state.addMonitorShow = bool
    },
    setUserMonitorList(state, list) {
        state.userMonitorList = list;
    },
    setMonitorDetail(state, detail) {
        state.monitorDetail = detail;
    },
    setMonitorSummary(state, summary) {
        state.monitorSummary = summary;
    },
    setMonitorContent(state, content) {
        state.monitorContent = content;
    },
};

export const actions = {
    async fetchMonitorList({commit}, searchName = '') {
        try {
            this._vm.$loading.start();
            const res = await this.$axios.get(`${monitorApi.getMonitorList}?searchName=${searchName}`);
            if (res && res.data && res.data.ok) {
                commit('setMonitorList', res.data.data);
            }
        } catch (e) {
            console.error('fetchMonitorList error:', e);
        } finally {
            this._vm.$loading.finish();
        }
    },
    async fetchUserMonitorList({commit}, payload) {
        try {
            this._vm.$loading.start();
            const {page, size, status} = {page: 2, size: 4, status: '', ...(payload||{})}
            const res = await this.$axios.get(`${monitorApi.getUserMonitoringList}?page=${page}&size=${size}&status=${status}`);
            if (res && res.data && res.data.ok) {
                commit('setUserMonitorList', res.data.data.records);
            }
        } catch (e) {
            console.error('fetchUserMonitorList error:', e);
        } finally {
            this._vm.$loading.finish();
        }
    },
    async addUserMonitor({dispatch, commit}, sourceIds) {
        try {
            this._vm.$loading.start();
            const res = await this.$axios.get(`${monitorApi.addUserMonitoring}?sourceIds=${sourceIds.join(',')}`);
            if (res && res.data && res.data.ok) {
                commit('setAddMonitorShow', false)
                dispatch('fetchUserMonitorList'); // Optionally refresh the user monitor list
            }
        } catch (e) {
            console.error('addUserMonitor error:', e);
        }  finally {
            this._vm.$loading.finish();
        }
    },
    async markUserMonitor({}, sourceId) {
        try {
            const res = await this.$axios.get(`${monitorApi.markUserMonitoring}?sourceId=${sourceId}`);
            return res && res.data && res.data.ok;
        } catch (e) {
            console.error('markUserMonitor error:', e);
            return false;
        }
    },
    async deleteUserMonitor({dispatch}, sourceId) {
        try {
            this._vm.$loading.start();
            const res = await this.$axios.get(`${monitorApi.deleteUserMonitoring}?sourceId=${sourceId}`);
            if (res && res.data && res.data.ok) {
                dispatch('fetchUserMonitorList'); // Optionally refresh the user monitor list
            }
        } catch (e) {
            console.error('deleteUserMonitor error:', e);
        }  finally {
            this._vm.$loading.finish();
        }
    },
    async fetchMonitorDetail({commit}, sourceId) {
        try {
            this._vm.$loading.start();
            const res = await this.$axios.get(`${monitorApi.getMonitoringDetail}?sourceId=${sourceId}`);
            if (res && res.data && res.data.ok) {
                commit('setMonitorDetail', res.data.data);
            }
        } catch (e) {
            console.error('fetchMonitorDetail error:', e);
        }  finally {
            this._vm.$loading.finish();
        }
    },
    async fetchMonitorSummary({commit}, sourceId) {
        try {
            const res = await this.$axios.get(`${monitorApi.getMonitoringSummary}?sourceId=${sourceId}`);
            if (res && res.data && res.data.ok) {
                commit('setMonitorSummary', res.data.data);
            }
        } catch (e) {
            console.error('fetchMonitorSummary error:', e);
        }
    },
    async fetchMonitorContent({commit}, sourceId) {
        try {
            const res = await this.$axios.get(`${monitorApi.getMonitoringSource}?sourceId=${sourceId}`);
            if (res && res.data && res.data.ok) {
                commit('setMonitorContent', res.data.data);
            }
        } catch (e) {
            console.error('fetchMonitorContent error:', e);
        }
    },
};