'use strict';

import BaseDevice from '../baseDevice';
const Homey = require('homey');
const axios = require('axios');
const {generateHash, generateHeader} = require('./../generateHash.js');


class BatteryDevice extends BaseDevice {

  async onInit() {
    await super.onInit();
    const flowActionsetChargeTimes = this.homey.flow.getActionCard('battery_set_charge_times');
    const flowActiongetChargeTimes = this.homey.flow.getActionCard('battery_get_charge_times');
    const flowActiongetDisChargeTimes = this.homey.flow.getActionCard('battery_get_discharge_times');
    const flowActionsetDischargeTimes = this.homey.flow.getActionCard('battery_set_discharge_times');

    /*
     * Update dischange times
     */
    flowActionsetDischargeTimes.registerRunListener(async (args, state) => {
      const sysSn = this.getSetting('sysSn');
      const header = generateHeader(this.homey, sysSn);

      try {

        var data = {
          sysSn: sysSn,
          batUseCap: args.batUseCap,
          ctrDis: args.ctrDis,
          timeDise1: args.timeDise1,
          timeDise2: args.timeDise2,
          timeDisf1: args.timeDisf1,
          timeDisf2: args.timeDisf2
        };

        const response = await axios.post(
          `https://openapi.alphaess.com/api/updateDisChargeConfigInfo`,
          data,
          header
        );

        this.log('Fetched', response.data);
      } catch (error) {
        this.error('Failed to fetch data:', error);
      }

      return true;
    });


    /*
     *
     */
    flowActiongetDisChargeTimes.registerRunListener(async (args, state) => {
      const sysSn = this.getSetting('sysSn');
      const header = generateHeader(this.homey, sysSn);

      try {
        const response = await axios.get(
          `https://openapi.alphaess.com/api/getDisChargeConfigInfo?sysSn=${sysSn}`,
          header,
        );

        var responseData = response.data;

        this.log('Fetched', responseData);

        return {
          "batUseCap": responseData.data.batUseCap,
          "ctrDis": responseData.data.ctrDis,
          "timeDise1": responseData.data.timeDise1,
          "timeDise2": responseData.data.timeDise2,
          "timeDisf1": responseData.data.timeDisf1,
          "timeDisf2": responseData.data.timeDisf2
        };

      } catch (error) {
        this.error('Failed to fetch data: ', error);
      }

      if (response.data?.code != 200) {
        this.error('Failed execute function: ', response.data?.expMsg);
      }
    });

    /*
     *
     */
    flowActiongetChargeTimes.registerRunListener(async (args, state) => {
      const sysSn = this.getSetting('sysSn');
      const header = generateHeader(this.homey, sysSn);

      try {
        const response = await axios.get(
          `https://openapi.alphaess.com/api/getChargeConfigInfo?sysSn=${sysSn}`,
          header,
        );

        var responseData = response.data;

        this.log('Fetched', responseData);

        return {
          "batHighCap": responseData.data.batHighCap,
          "gridCharge": responseData.data.gridCharge,
          "timeChae1": responseData.data.timeChae1,
          "timeChae2": responseData.data.timeChae2,
          "timeChaf1": responseData.data.timeChaf1,
          "timeChaf2": responseData.data.timeChaf2
        };

      } catch (error) {
        this.error('Failed to fetch data: ', error);
      }

      if (response.data?.code != 200) {
        this.error('Failed execute function: ', response.data?.expMsg);
      }
    });

    /*
     * Update change times
     */
    flowActionsetChargeTimes.registerRunListener(async (args, state) => {
      const sysSn = this.getSetting('sysSn');
      const header = generateHeader(this.homey, sysSn);

      try {

        var data = {
          sysSn: sysSn,
          batHighCap: args.batHighCap,
          gridCharge: args.gridCharge,
          timeChaf1: args.timeChaf1,
          timeChae1: args.timeChae1,
          timeChaf2: args.timeChaf2,
          timeChae2: args.timeChae2
        };

        const response = await axios.post(
          `https://openapi.alphaess.com/api/updateChargeConfigInfo`,
          data,
          header
        );

        this.log('Fetched', response.data);
      } catch (error) {
        this.error('Failed to fetch data:', error);
      }

      return true;
    });
  }

  async setCapabilities(data) {
    await Promise.all([
      this.setCapabilityValue('measure_battery', data.soc),
      this.setCapabilityValue('measure_power', data.pbat * -1)
      
    ]);
  }

}

module.exports = BatteryDevice;
