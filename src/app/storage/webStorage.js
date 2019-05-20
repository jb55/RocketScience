/**
 * Storage for larger files up to 5MB in total size.
 * @constructor
 */
export function WebStorage() {
    const setItem = (key, value) => {
        localStorage.setItem(key, value);
    };

    const getItem = (key) => {
        return localStorage.getItem(key);
    };

    const removeItem = (key) => {
        localStorage.removeItem(key);
    };

    const getAllKeys = () => {
        return Object.keys(localStorage);
    };

    /**
     * Remove the mission progress from the storage.
     * @param missionName {String} The name of the mission.
     */
    this.clearMissionProgress = (missionName) => {
        removeItem(WebStorage.PREFIX_MISSION_PROGRESS + missionName);
    };

    /**
     * Store the mission progress in the storage.
     * @param missionName {String} The name of the mission.
     * @param data {String} The data that has to be stored.
     */
    this.saveMissionProgress = (missionName, data) => {
        setItem(WebStorage.PREFIX_MISSION_PROGRESS + missionName, data);
    };

    /**
     * Obtain the mission progress from the storage.
     * @param missionName {String} The name of the mission.
     * @return {String} The mission data.
     */
    this.getMissionProgress = (missionName) => {
        return getItem(WebStorage.PREFIX_MISSION_PROGRESS + missionName);
    };

    /**
     * Remove the custom mission.
     * @param missionName {String} The name of the mission.
     */
    this.removeCustomMission = (missionName) => {
        removeItem(WebStorage.PREFIX_CUSTOM_MISSION + missionName);
    };

    /**
     * Save the custom mission to the storage.
     * @param missionName {String} The name of the mission.
     * @param data {String} The mission data.
     */
    this.saveCustomMission = (missionName, data) => {
        setItem(WebStorage.PREFIX_CUSTOM_MISSION + missionName, data);
    };

    /**
     * Obtain the custom mission.
     * @param missionName {String} The name of the mission.
     */
    this.getCustomMission = (missionName) => {
        getItem(WebStorage.PREFIX_CUSTOM_MISSION + missionName);
    };

    /**
     * Obtain all the custom missions.
     * @param onLoad {Function} Function that is called for each loaded custom mission.
     */
    this.getAllCustomMissions = (onLoad) => {
        for (const key in getAllKeys()) {
            if (key.startsWith(WebStorage.PREFIX_CUSTOM_MISSION))
                onLoad(getItem(key));
        }
    };

    /**
     * Remove the PCB from storage.
     * @param pcbName {String} The name of the PCB.
     */
    this.removePcb = (pcbName) => {
        removeItem(WebStorage.PREFIX_PCB + pcbName);
    };

    /**
     * Store the PCB to storage.
     * @param pcbName {String} The name of the PCB
     * @param data {String} The data of the PCB.
     */
    this.savePcb = (pcbName, data) => {
        setItem(WebStorage.PREFIX_PCB + pcbName, data);
    };

    /**
     * Obtain the PCB data.
     * @param pcbName {String} The PCB data.
     */
    this.getPcb = (pcbName) => {
        getItem(WebStorage.PREFIX_PCB + pcbName);
    };

    /**
     * Obtain all PCBs from storage.
     * @param onLoad {Function} Function that is called for each loaded PCB.
     */
    this.getAllPcbs = (onLoad) => {
        for (const key in getAllKeys()) {
            if (key.startsWith(WebStorage.PREFIX_PCB))
                onLoad(getItem(key));
        }
    };
}

WebStorage.PREFIX_MISSION_PROGRESS = "progress-";
WebStorage.PREFIX_CUSTOM_MISSION = "custom-";
WebStorage.PREFIX_PCB = "PCB-";