var config = [
  {
    itemId:'sliderformfield',
    xtype:'sliderfield',
    label:'standard slider',
    minValue:1,
    maxValue:100,
    increment:10,
    value:90,
    height:'3.3em' // otherwise it takes up the whole height for some reason
  },
  {
    label:'single (plain)',
    xtype:'jepsliderfield',
    minValue:1,
    maxValue:10,
    increment:1,
    value:3
  },
  {
    label:'single (with increments and min, max and thumb labels)',
    xtype:'jepsliderfield',
    minValue:1,
    maxValue:10,
    increment:1,
    showIncrements:true,
    showThumbLabels:true,
    showMinLabel:true,
    showMaxLabel:true,
    value:3
  },
  {
    label:'two thumbs (with range, increments marks and thumb labels)',
    xtype:'jepsliderfield',
    minValue:1,
    maxValue:100,
    increment:10,
    showRange:true,
    showIncrements:true,
    showThumbLabels:true,
    values:[20, 50]
  },
  {
    label:'three thumbs',
    xtype:'jepsliderfield',
    minValue:1,
    maxValue:100,
    increment:10,
    showRange:true,
    showIncrements:true,
    showThumbLabels:true,
    values:[20, 50, 70]
  },
  {
    label:'large values',
    xtype:'jepsliderfield',
    minValue:10000,
    maxValue:90000,
    increment:10000,
    showRange:true,
    showIncrements:true,
    showThumbLabels:true,
    showMinLabel:true,
    showMaxLabel:true,
    values:[20000, 50000, 70000]
  },
  {
    label:'drawn increment larger than actual increment (with range)',
    xtype:'jepsliderfield',
    minValue:1,
    maxValue:100,
    increment:1,
    showRange:true,
    showIncrements:10,
    showThumbLabels:true,
    showMinLabel:true,
    showMaxLabel:true,
    values:[24, 58],
  },
  {
    label:'getThumbLabel override',
    xtype:'jepsliderfield',
    minValue:1,
    maxValue:4,
    increment:1,
    showRange:true,
    showIncrements:true,
    showThumbLabels:true,
    showMinLabel:true,
    showMaxLabel:true,
    value:3,
    getLabel:function (slider, value, isMinMaxLabel) {
      return ['Terrible', 'Bad', 'Average', 'Good', 'Great'][value]
    }
  }
];

new Ext.Application({
  name: 'app',
  launch: function() {
    Ext.EventManager.onWindowResize(function () {
      Ext.Viewport.updateBodySize();
    });

    this.viewport = new Ext.TabPanel({
      fullscreen:true,
      items:[
        Ext.create(
          {
            xtype:'panel',
            title:'Not in form',
            scroll:'vertical',
            layout:'vbox',
            items:config,
            defaults:{
//              showMinLabel:true,
//              showMaxLabel:true
            }
          }
        ),

        Ext.create(
          {
            xtype:'formpanel',
            title:'In form',
            scroll:'vertical',
            items:config
          }
        )

      ]
    });
  }
});
