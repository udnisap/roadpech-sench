/*
 * File: app/controller/MapController.js
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

Ext.define('Roadpech.controller.MapController', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.Map'
    ],
    config: {
        markers: {
        },
        settings: {
            heatmap: 1,
            addItem: 0,
            curLocation: 1,
            fusion: {
                roadSegments: {},
                levels: [
                    {fillColor: "#bbf7bb"}, //orange
                    {fillColor: "#1cd41c"}, //green
                    {fillColor: "#FFFF00"}, //yellow  
                    {fillColor: "#FF0000"}, //red     

                ],
                traffic: []
            }

        },
        models: [
            'Marker'
        ],
        stores: [
            'Markers'
        ],
        views: [
            'Marker',
            'MapPanel',
            'SettingsForm'
        ],
        routes: {
            'map/marker/:marker': 'viewMarker'
        },
        refs: {
            map: '#map',
            markerPanel: {
                autoCreate: true,
                selector: 'markerView',
                xtype: 'markerView'
            },
            settingsPanel: {
                autoCreate: true,
                selector: 'settingsform',
                xtype: 'settingsform'
            },
            userPanel: {
                autoCreate: true,
                selector: 'userPanel',
                xtype: 'UserPanel'
            },
            markerInfo: 'label#markerInfo',
            timeSlider: '#timeslider'
        },
        control: {
            "#map": {
                initialize: 'onMapInitialize',
                maprender: 'onMapMaprender',
                centerchange: 'onMapCenterChange',
                zoomchange: 'onMapZoomChange'
            },
            "button#back": {
                tap: 'onBackTap'
            },
            "button#update": {
                tap: 'onUpdateTap'
            },
            "button#settingsBack": {
                tap: 'onSettingsBackTap'
            },
            "button#settingsSave": {
                tap: 'onSettingsSaveTap'
            },
            "button#settingsClear": {
                tap: 'onSettingsClearTap'
            },
            "button#add": {
                tap: 'onAddTap'
            },
            "button#settings": {
                tap: 'onSettingsTap'
            },
            "button#heatmap": {
                tap: 'onHeatmapTap'
            },
            "button#location": {
                tap: 'onLocationTap'
            },
            "button#user": {
                tap: 'onUserTap'
            },
            "button#userBack": {
                tap: 'onUserBackTap'
            },
            "markerPanel": {
                activate: 'onFormpanelActivate'
            },
            "timeSlider": {
                change: 'onSliderChange'
            }
        }
    },
    onMapInitialize: function(component, eOpts) {
        var map = this.getMap();
        gmap = map.getMap();

        map.setConfig({
            mapOptions: {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(6.916149391823985, 79.87763274584961),
                //center: new google.maps.LatLng(6.79724,79.901837),
                zoom: 17
            }
        });
    },
    showTraffic: function(time) {
        var f = this.getSettings().fusion;
        Ext.each(f.traffic, function(o, i) {
            f.roadSegments[o.road].setOptions(f.levels[o["level_"+time]]);
        });

    },
    onSliderChange: function(me, Slider, thumb, newValue, oldValue, eOpts) {
        if (newValue === 0) {
            Ext.Msg.alert('Current traffic level is shown.');
        } else {
            Ext.Msg.alert('Traffic level in ' + newValue + ' mins ahead is shown.');
        }
        this.showTraffic(newValue);
    },
    onMapMaprender: function(map, gmap, eOpts) {
        gmap = map.getMap();
        var me = this,
                markers = Ext.getStore("markers"),
                f = this.getSettings().fusion;

        me.editModeEventListners(gmap);
        //load markers
        me.loadMarkers(map.getMap().getBounds());


        Ext.Ajax.request({
            url: 'http://roadpech.ideawide.com/api/index.php/road/',
            success: function(response) {
                var obj = JSON.parse(response.responseText);
                var def = {
                    fillOpacity: 0.6
                };
                f.prediction = {};
                Ext.each(obj, function(o, i) {
                    var road = [];
                    Ext.each(o.segment, function(oo, j) {
                        road.push(new google.maps.LatLng(oo[0], oo[1]));
                    });
                    var polyOptions = Ext.Object.merge({path: road}, def);
                    var poly = new google.maps.Polygon(polyOptions);
                    poly.setMap(gmap);
                    f.roadSegments[o.id] = poly;
                });
            }
        });
        //get Traffic
        Ext.Ajax.request({
            url: 'http://roadpech.ideawide.com/api/index.php/prediction/',
            success: function(response) {
                var obj = JSON.parse(response.responseText);
                Ext.each(obj, function(o, i) {
                    f.traffic.push(o);
                });
                me.showTraffic(0);
            }
        });
        
        this.geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: function(geo) {
                    gmap.panTo(new google.maps.LatLng(geo.getLatitude(), geo.getLongitude()))
                }
            }
        });

        this.geocoder = new google.maps.Geocoder();
    },
    onMapCenterChange: function(map, gmap, center, eOpts) {
        this.loadMarkers(map.getMap().getBounds());
    },
    onMapZoomChange: function(map, gmap, zoomLevel, eOpts) {
        this.loadMarkers(map.getMap().getBounds());
    },
    onBackTap: function(button, e, eOpts) {
        this.redirectTo('map');
    },
    onUpdateTap: function(button, e, eOpts) {
        var markerPanel = this.getMarkerPanel(),
                markers = Ext.getStore('markers'),
                marker = markerPanel.getRecord(),
                values = markerPanel.getValues();
        markerPanel.setMasked({
            xtype: 'loadmask',
            message: 'Saving'
        });
        marker.setTrafficLevel(values.traffic_level);
        this.redirectTo('map');

        markerPanel.setMasked(false);

    },
    onSettingsBackTap: function(button, e, eOpts) {
        this.redirectTo('map');
    },
    onSettingsSaveTap: function(button, e, eOpts) {
        var me = this,
                settingsPanel = me.getSettingsPanel(),
                settings = settingsPanel.getValues(),
                map = me.getMap(),
                gmap = map.getMap(),
                markers = Ext.getStore("markers");
        this.settings = settings;
        settingsPanel.setMasked({
            xtype: 'loadmask',
            message: 'Saving'
        });


        if (settings.addItem) {
            //add map click event
            this.addEventListner = google.maps.event.addListener(gmap, 'click', function(e) {
                var options = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                };
                var marker = Ext.create('Roadpech.model.Marker', options);
                markers.add(marker);
                me.addMarker(marker, {
                    draggable: true,
                    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=3|69FE96"
                });
            });
        } else {
	    //remove event listners
            if (this.addEventListner) {
                google.maps.event.removeListener(this.addEventListner);
            }
        }

        if (settings.heatmap) {
            this.traficLayer.setMap(gmap);
        } else {
            this.traficLayer.setMap(null);
        }

        if(settings.curLocation){
     	   map.useCurrentLocation(true);
        }else{
          map.useCurrentLocation(false);
        }
       
        this.redirectTo('map');
        settingsPanel.setMasked(false);
    },
    onSettingsClearTap: function(button, e, eOpts) {
        var markers = Ext.getStore("markers");
        markers.removeAll();
        this.redirectTo('map');
    },
    onAddTap: function(button, e, eOpts) {
        var me = this,
                map = me.getMap(),
                gmap = map.getMap(),
                markers = Ext.getStore("markers"),
                latlng = gmap.getCenter(),
                options = {
            lat: latlng.lat(),
            lng: latlng.lng(),
            colour: "ADDE63"
        };

        var marker = Ext.create('Roadpech.model.Marker', options);
        markers.add(marker);
        me.addMarker(marker, {
            draggable: true,
        });

        if (!this.newlyAdded) {
            this.newlyAdded = 0;
        }
        this.newlyAdded++;
        button.setBadgeText(this.newlyAdded);
    },
    onSettingsTap: function(button, e, eOpts) {
        var view = this.getSettingsPanel(),
                settings = this.getSettings();
        if (settings)
            view.setData(settings);
        Ext.Viewport.setActiveItem(view);
    },
    onHeatmapTap: function(button, e, eOpts) {
        var settings = this.getSettings()
        if (this.traficLayer.getMap()) {
            settings.heatmap = 0;
            this.traficLayer.getMap(null)
        } else {
            settings.heatmap = 1;
            this.traficLayer.getMap(this.getMap().getMap());
        }
    },
    onLocationTap: function(button, e, eOpts) {
        this.geo.updateLocation();
    },
    onUserTap: function(button, e, eOpts) {
        var view = this.getUserPanel(),
                markers = Ext.getStore("markers");
        view.setData({
            markers: markers.getCount()
        });
        Ext.Viewport.setActiveItem(view);
    },
    onUserBackTap: function(button, e, eOpts) {
        this.redirectTo('map');
    },
    onFormpanelActivate: function(newActiveItem, container, oldActiveItem, eOpts) {
        var marker = this.getMarkerPanel().getValues(),
                me = this;
        this.geocoder.geocode({'location': new google.maps.LatLng(marker.lat, marker.lng)}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                me.getMarkerInfo().setHtml(results[0].formatted_address);
            } else {
                me.getMarkerInfo().setHtml("Geocode was not successful.");
            }
        });
    },
    editModeEventListners: function(gmap) {
        var settings = this.getSettings();
        if (settings.addItem) {
            //Map click event
            this.addEventListner = google.maps.event.addListener(gmap, 'click', function(e) {
                var options = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                };
                var marker = Ext.create('Roadpech.model.Marker', options);
                markers.add(marker);
                me.addMarker(marker, {
                    draggable: true,
                    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=3|69FE96"
                });
            });
        } else {
            if (this.addEventListner) {
                google.maps.event.removeListener(this.addEventListner);
            }
        }
    },
    addMarker: function(marker, gmOptions) {
        var pos = new google.maps.LatLng(marker.get('lat'), marker.get('lng')),
                hash = pos.toString(),
                me = this,
                markersHash = this.getMarkers();

        if (markersHash[hash])
            return;

        gmOptions = (gmOptions) ? gmOptions : {};
        var level = marker.get('traffic_level');
        var gmReqOptions = {
            map: this.getMap().getMap(),
            animation: google.maps.Animation.DROP,
            position: pos,
        };

        Ext.Object.merge(gmReqOptions, gmOptions);

        gMarker = new google.maps.Marker(gmReqOptions);
        marker.setMapMarker(gMarker);

        //onMarkerClick
        google.maps.event.addListener(gMarker, 'click', function() {
            me.redirectTo('map/' + marker.toUrl());
        });


        //onMarkerDrag
        google.maps.event.addListener(gMarker, 'dragend', function(e) {
            marker.setLocation(e.latLng);
        });

        markersHash[hash] = gMarker;

    },
    updateMarker: function(marker) {
        var pos = new google.maps.LatLng(marker.get('lat'), marker.get('lng')),
                hash = pos.toString();

        if (!markersHash[hash])
            return;



    },
    loadMarkers: function(bound) {
        var markers = Ext.getStore('markers');
        var me = this;
        Ext.each(markers.getData().items, function(marker) {
            me.addMarker(marker);
        });

    },
    viewMarker: function(marker) {
        var marker = Ext.getStore('markers').getById(marker),
                markerPanel = this.getMarkerPanel();

        this.getMarkerInfo().setHtml("Loading location information.");
        markerPanel.setRecord(marker);
        Ext.Viewport.setActiveItem(markerPanel);

        if (marker) {
            markerPanel.setRecord(marker);
            Ext.Viewport.setActiveItem(markerPanel);
        } else {
            Ext.Msg.alert('Error', 'Marker not found');
            this.redirectTo('map');
        }
    }

});
