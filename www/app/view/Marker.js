/*
 * File: app/view/Marker.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Roadpech.view.Marker', {
    extend: 'Ext.form.Panel',
    alias: 'widget.markerView',

    config: {
        modal: false,
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Update the Traffic Level',
                items: [
                    {
                        xtype: 'button',
                        itemId: 'back',
                        ui: 'back',
                        iconCls: 'arrow_left',
                        text: ''
                    }
                ]
            },
            {
                xtype: 'fieldset',
                centered: false,
                title: 'Marker Options',
                items: [
                    {
                        xtype: 'container',
                        width: '100%',
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                xtype: 'image',
                                flex: 3,
                                height: 50,
                                src: 'marker.png'
                            },
                            {
                                xtype: 'label',
                                flex: 7,
                                html: 'Getting Locaiton information',
                                itemId: 'markerInfo',
                                padding: '15px'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        centered: false,
                        label: 'Lat',
                        name: 'lat',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        label: 'Lng',
                        name: 'lng',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        label: 'User Count',
                        name: 'usercount',
                        readOnly: true
                    },
                    {
                        xtype: 'spinnerfield',
                        label: 'Traffic Level',
                        name: 'traffic_level',
                        maxValue: 5,
                        minValue: 0,
                        stepValue: 1
                    },
                    {
                        xtype: 'datepickerfield',
                        hidden: true,
                        label: 'Updated Time',
                        name: 'time_stamp',
                        placeHolder: 'mm/dd/yyyy'
                    }
                ]
            },
            {
                xtype: 'button',
                disabled: false,
                itemId: 'update',
                padding: '',
                ui: 'confirm',
                text: 'Update'
            }
        ]
    }

});