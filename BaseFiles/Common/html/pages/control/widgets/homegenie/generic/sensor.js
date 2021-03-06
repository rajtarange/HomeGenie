﻿[{
    Name: "Generic Sensor",
    Author: "Generoso Martello",
    Version: "2013-10-04",

    GroupName: '',
    IconImage: 'pages/control/widgets/homegenie/generic/images/sensor.png',
    StatusText: '',
    Description: '',
    Initialized: false,

    RenderView: function (cuid, module) {
        var container = $(cuid);
        var widget = container.find('[data-ui-field=widget]');
        //
        if (!this.Initialized) {
            this.Initialized = true;
            //
            // ui events handlers
            //
            // settings button
            widget.find('[data-ui-field=settings]').on('click', function () {
                HG.WebApp.Control.EditModule(module);
            });
        }
        widget.find('[data-ui-field=name]').html(module.Name);
        //
        var sensorimgdata = '';
        var sensortxtdata = '';
        var infotext = '';
        var lastupdatetime = 0;
        if (module.Properties != null) {
            for (p = 0; p < module.Properties.length; p++) {
                if (module.Properties[p].Name.indexOf('Sensor.') == 0 || module.Properties[p].Name == 'Meter.Watts' || module.Properties[p].Name == 'Status.Level' || module.Properties[p].Name == 'Status.Battery') {
                    var value = Math.round(module.Properties[p].Value.replace(',', '.') * 10) / 10;
                    if (isNaN(value)) value = module.Properties[p].Value;
                    //
                    var displayname = module.Properties[p].Name.replace('Sensor.', '');
                    displayname = displayname.replace('Meter.', '');
                    displayname = displayname.replace('Status.', '');
                    displayname = '<b>' + displayname + '</b>';
                    //
                    var displayvalue = value;
                    //
                    var updatetime = module.Properties[p].UpdateTime;
                    updatetime = updatetime.replace(' ', 'T'); // fix for IE and FF
                    var d = new Date(updatetime);
                    if (lastupdatetime < d) {
                        lastupdatetime = d;
                    }
                    //
                    var imagesrc = '';
                    //
                    if (module.Properties[p].Name == 'Status.Battery') {
                        var blevel = 0;
                        blevel = parseFloat(module.Properties[p].Value);
                        if (blevel == 255) blevel = 0;
                        else if (blevel > 80 && blevel <= 100) blevel = 100;
                        else if (blevel > 60) blevel = 80;
                        else if (blevel > 40) blevel = 60;
                        else if (blevel > 20) blevel = 40;
                        else if (blevel > 10) blevel = 20;
                        else if (blevel > 0) blevel = 10;
                        //
                        infotext += '<span style="vertical-align:middle">' + value + '%</span> <img style="vertical-align:middle" src="pages/control/widgets/homegenie/generic/images/battery_level_' + blevel + '.png" />';
                        continue;
                    }
                    else if (module.Properties[p].Name == 'Sensor.Temperature') {
                        imagesrc = 'hg-indicator-temperature';
                        var temp = module.Properties[p].Value.replace(',', '.');
                        if (HG.WebApp.Locales.GetDateEndianType() == 'M') {
                            // display as Fahrenheit
                            temp = Math.round((temp * 1.8 + 32) * 10) / 10;
                            displayvalue = temp + '&#8457;';
                        } else {
                            // display as Celsius
                            temp = Math.round(temp * 10) / 10;
                            displayvalue = temp + '&#8451;';
                        }
                    }
                    else if (module.Properties[p].Name == 'Sensor.Luminance') {
                        imagesrc = 'hg-indicator-luminance';
                        displayvalue = value + '%';
                    }
                    else if (module.Properties[p].Name == 'Sensor.Humidity') {
                        imagesrc = 'hg-indicator-humidity';
                        displayvalue = value + '%';
                    }
                    if (module.Properties[p].Name == 'Meter.Watts') {
                        imagesrc = 'hg-indicator-energy';
                    }
                    else if (module.Properties[p].Name == 'Sensor.DoorWindow') {
                        imagesrc = 'hg-indicator-door';
                    }
                    else if (module.Properties[p].Name == 'Sensor.Alarm') {
                        imagesrc = 'hg-indicator-alarm';
                    }
                    else if (module.Properties[p].Name == 'Sensor.Generic') {
                        imagesrc = 'hg-indicator-generic';
                    }
                    else if (module.Properties[p].Name == 'Status.Level') {
                        imagesrc = 'hg-indicator-level';
                    }
                    if (imagesrc != '') {
                        displayname = '<span class="' + imagesrc + '" style="padding-left:0;width:20px;">&nbsp;</span>';
                        sensorimgdata += '<div style="margin-left:10px;height:28px;float:left"><div align="right" style="padding-right:4px;width:60px;float:left;text-align:bottom;line-height:28px">' + displayname + '</div><div align="left" style="padding-left:4px;float:left;font-size:18pt">' + displayvalue + '</div></div>';
                    }
                    else {
                        sensortxtdata += '<div style="margin-left:10px;height:28px;float:left"><div align="right" style="padding-right:4px;width:60px;float:left;font-size:11pt;font-weight:bold;text-align:bottom;line-height:28px;overflow:hidden;text-overflow:ellipsis;">' + displayname + '</div><div align="left" style="padding-left:4px;float:left;text-align:bottom;line-height:28px;font-size:18pt">' + displayvalue + '</div></div>';
                    }
                }
            }
        }
        //
        var widgeticon = HG.WebApp.Utility.GetModulePropertyByName(module, 'Widget.DisplayIcon');
        if (widgeticon != null && widgeticon.Value != '') {
            this.IconImage = widgeticon.Value;
        }
        //
        widget.find('[data-ui-field=description]').html((module.Domain.substring(module.Domain.lastIndexOf('.') + 1)) + ' ' + module.Address);
        //
        if (sensorimgdata != '') sensorimgdata = sensorimgdata + '<br clear="all" />';
        if (sensortxtdata != '') sensortxtdata = sensortxtdata + '<br clear="all" />';
        widget.find('[data-ui-field=status]').html(infotext);
        widget.find('[data-ui-field=sensorstatus]').html(sensorimgdata + sensortxtdata);
        widget.find('[data-ui-field=icon]').attr('src', this.IconImage);
        if (lastupdatetime > 0) {
            this.UpdateTime = HG.WebApp.Utility.FormatDate(lastupdatetime) + ' ' + HG.WebApp.Utility.FormatDateTime(lastupdatetime);
            widget.find('[data-ui-field=updatetime]').html(this.UpdateTime);
        }
    }

}]