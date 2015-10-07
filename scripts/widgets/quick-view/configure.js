define(["modules/jquery-mozu"], function ($) {
    
	var Ext = top.Ext;
	var Taco = top.Taco;
	var BLConfig = top.BLConfig = {};
    var qvObj = require.mozuData('blQuickView');
    
    var cbGroup = Ext.create('Ext.form.CheckboxGroup', {
        columns : 3,
        autoShow: false,
        listeners: {
            change: function(t,n,o,e){
                var v = [];
                Ext.Array.forEach(t.getChecked(), function(e,i){
                    v.push(e.inputValue);
                });
                productTypeAttributes.setValue(JSON.stringify(v));
                    
            }
        }
        
        
    });
    
    var productTypeStore = Taco.core.data.StoreManager.getOrCreate('Taco.store.ProductTypes');
    
    var productType = Ext.create('Ext.form.field.Text',
        {
            xtype: 'textfield',
            name: 'chartProductType',
            fieldLabel: '',
            width: 200,
            queryMode : 'local',
            disabled: false,
            hidden : true,
            listeners: {
                render: function(t,c,p,e){
                    /*console.log(t.value);
                    var d = JSON.parse(t.value);
                    myStore.add(d);*/
                }
            }
        }
    );
    var productTypeAttributes = Ext.create('Ext.form.field.Text',
        {
            xtype: 'textfield',
            name: 'chartProductTypeAttr',
            fieldLabel: '',
            width: 200,
            queryMode : 'local',
            disabled: false,
            hidden : true,
            listeners: {
                render: function(t,c,p,e){
                    /*console.log(t.value);
                    var d = JSON.parse(t.value);
                    myStore.add(d);*/
                }
            }
        }
    );
    
   Ext.cmd.derive('BLConfig.ProductTypeAttributeSelector', Taco.core.ux.form.Form, {
        defaults: {
            width: 435,
            xtype: 'textfield'
        },
        listeners: {
          afterrender: function(t,o){
             /* console.log(t);
              console.log(this);*/
          }  
        },
        items: [
            {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                    align: 'left'
                },
                items: [
                    productTypeAttributes,
                    {
                      xtype: "combo",
                      fieldLabel: "Chart Product Type",
                      store: productTypeStore,
                      displayField: "name",
                      valueField: "id",
                      query: "local",
                      editable: false,
                      forceSelection: true,
                      submitValue : false,
                      listeners: {
                          change: function(t,n,o,k){
                              cbGroup.removeAll();
                              var pType = productTypeStore.findRecord('id', n);
                              var stored = [];
                              if(productTypeAttributes.value !== undefined && productTypeAttributes.value !== null &&productTypeAttributes.value !== ''){
                                stored = JSON.parse(productTypeAttributes.value);
                              }
                              
                              
                              Ext.Array.forEach(pType.data.properties, function(e,i){
                                  var cb = Ext.create("Ext.form.field.Checkbox", {
                                    boxLabel: e.attributeName,
                                    inputValue : e,
                                    name: 'productTypeAttributeCB'
                                  });
                                  
                                  if($.inArray(e,stored) !== -1){
                                      cb.value = true;
                                  }
                                  cbGroup.add(cb);
                                });
                          },
                          render: function(t,o){
                              console.log(t);
                          }
                      }
                    },
                    cbGroup
                    
                ]
            }
        ]
    }, 0, 0, [
        'panel',
        'form',
        'component',
        'container',
        'formform',
        'box',
        'blconfig-producttypeattributeselector',
        'blconfig.producttypeattributeselector'
    ], {
        panel: true,
        form: true,
        component: true,
        container: true,
        formform: true,
        box: true,
        'blconfig-producttypeattributeselector': true,
        'blconfig.producttypeattributeselector' : true
    }, [
        'widget.blconfig-producttypeattributeselector',
        'widget.blconfig.producttypeattributeselector'
    ], 0, [
        BLConfig,
        'ProductTypeAttributeSelector'
    ], 0);
    console.log(qvObj);
    
});











