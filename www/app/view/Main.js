/*
 * File: app/view/Main.js
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

Ext.define('Roadpech.view.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.mainView',

    requires: [
        'Roadpech.view.MapPanel',
        'Roadpech.view.SettingsForm'
    ],

    config: {
        layout: {
            animation: 'slide',
            type: 'card'
        },
        items: [
            {
                xtype: 'mapPanel',
                title: 'Map',
                iconCls: 'maps'
            },
            {
                xtype: 'settingsform',
                title: 'Settings',
                iconCls: 'settings'
            }
        ],
        tabBar: {
            docked: 'bottom',
            hidden: true
        }
    }

});