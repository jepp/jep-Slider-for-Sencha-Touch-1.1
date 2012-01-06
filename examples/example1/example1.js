var config = [
  {
    itemId:'sliderformfield',
    xtype:'sliderfield',
    label:'standard slider',
    minValue:0,
    maxValue:100,
    increment:10,
    value:90
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
    label:'two thumbs (with increment marks)',
    xtype:'jepsliderfield',
    showIncrements:true,
    minValue:0,
    maxValue:100,
    increment:10,
    values:[20, 50]
  },
  {
    label:'two thumbs (with range)',
    xtype:'jepsliderfield',
    showRange:true,
    minValue:0,
    maxValue:100,
    increment:10,
    values:[20, 50]
  },
  {
    label:'two thumbs (with range, increments and labels)',
    xtype:'jepsliderfield',
    showRange:true,
    minValue:0,
    maxValue:100,
    increment:10,
    showIncrements:true,
    showThumbLabels:true,
    values:[20, 50]
  },
  {
    label:'three thumbs',
    xtype:'jepsliderfield',
    showRange:true,
    minValue:0,
    maxValue:100,
    increment:10,
    showIncrements:true,
    showThumbLabels:true,
    values:[20, 50, 70]
  },
  {
    label:'large values',
    xtype:'jepsliderfield',
    showRange:true,
    minValue:10000,
    maxValue:90000,
    increment:10000,
    showIncrements:true,
    showThumbLabels:true,
    values:[20000, 50000, 70000]
  },
  {
    label:'drawn increment larger than actual increment',
    xtype:'jepsliderfield',
    minValue:1,
    maxValue:100,
    increment:1,
    showIncrements:10,
    showThumbLabels:true,
    value:24,
  },
  {
    label:'drawn increment larger than actual increment (with range)',
    xtype:'jepsliderfield',
    showRange:true,
    minValue:1,
    maxValue:100,
    increment:1,
    showIncrements:10,
    showThumbLabels:true,
    values:[24, 58],
  },
  {
    label:'getThumbLabel override (win showMinLabel and showMaxLabel)',
    xtype:'jepsliderfield',
    showRange:true,
    minValue:0,
    maxValue:4,
    increment:1,
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
    this.viewport = new Ext.TabPanel({
      fullscreen:true,
      items:[
        Ext.create(
          {
            xtype:'panel',
            title:'Not in form',
            scroll:'vertical',
            layout:'vbox',
            defaults:{
              height:61,
            },
            items:config
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
