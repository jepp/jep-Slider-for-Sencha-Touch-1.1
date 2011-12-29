new Ext.Application({
  name: 'app',
  launch: function() {
    this.viewport = new Ext.Panel({
      fullscreen:true,
      items:[
        {
          html:'In form:'
        },
        {
          xtype:'formpanel',
          items:[
            {
              xtype:'jepsliderfield',
              label:'jepsliderfield',
              minValue:0,
              maxValue:100,
              increment:10,
              values:[10, 60]
            },
            {
              xtype:'jeprangesliderfield',
              label:'jeprangesliderfield',
              minValue:0,
              maxValue:100,
              increment:10,
              values:[10, 60]
            }
          ]
        },
        {
          html:'Not in form:'
        },
        {
          xtype:'jepsliderfield',
          minValue:0,
          maxValue:100,
          increment:10,
          values:[10, 60]
        },
        {
          xtype:'jeprangesliderfield',
          minValue:0,
          maxValue:100,
          increment:10,
          values:[10, 60]
        }
      ]
    });
  }
});