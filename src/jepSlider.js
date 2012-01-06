Ext.namespace("jep.field");

/**
 * @class jep.field.Slider
 * @extends Ext.form.Field
 * Create a slider with the following features possible:
 * * increment marks, including ones not directly on every increment
 * * multiple thumbs
 * * minimum distance between thumbs
 * * customizable thumb labels
 * @author jep
 * @version 2.0
 */
jep.field.Slider = Ext.extend(Ext.form.Field, {
  /**
   * @cfg {Number} animationDuration When set to a number greater than 0, it will be the animation duration in ms (defaults to 200)
   */
  animationDuration:200,

  /**
   * @cfg {String} getLabel Function to call to translate thumb value into thumb label if showThumbLabels is used
   * @param {jep.field.Slider} slider The slider calling the function
   * @param {Number} value The value at the label
   * @param {Boolean} isMinMaxLabel Whether this label call is being used for {@link showMinLabel} or {@link showMaxLabel}
   * @return {String} The label to appear
   */
  getLabel:function (slider, value, isMinMaxLabel) {
    return value;
  },

  /**
   * @cfg {Number} increment The increment by which to snap each thumb when its value changes. Defaults to 1. Any thumb movement
   * will be snapped to the nearest value that is a multiple of the increment (e.g. if increment is 10 and the user tries to move
   * the thumb to 67, it will be snapped to 70 instead)
   */
  increment:1,

  /**
   * @cfg {String} maxLabel If defined and {@link showMaxLabel} is true, this string will be used for the label for the
   * {@link maxValue}.  If undefined and {@link showMaxLabel} is false, getLabel will be called to create the label
   */
  maxLabel:undefined,

  /**
   * @cfg {Number} maxValue The highest value any thumb on this slider can be set to (defaults to 100)
   */
  maxValue:100,

  /**
   * @cfg {Number} minDistance The minimum distance to snap a thumb to relative to its neighbor.  This is the minimum amount
   * of distance between two thumbs when multiple thumbs are used.  To allow thumbs to be set to the same value, use a value of 0.
   * When undefined (the default), the minimum distance is equal to one increment value.
   */
  minDistance:undefined,

  /**
   * @cfg {String} minLabel If defined and {@link showMinLabel} is true, this string will be used for the label for the
   * {@link minValue}.  If undefined and {@link showMinLabel} is false, getLabel will be called to create the label
   */
  minLabel:undefined,

  /**
   * @cfg {Number} minValue The lowest value any thumb on this slider can be set to (defaults to 0)
   */
  minValue:0,

  /**
   * @cfg {Mixed} showIncrements Determines if increments are drawn on the slider
   * (defaults to false)
   */
  showIncrements:false,

  /**
   * @cfg {Boolean} showMinLabel Determines if a label is drawn for the minValue
   * (defaults to false)
   */
  showMinLabel:false,

  /**
   * @cfg {Boolean} showMaxLabel Determines if a label is drawn for the maxValue
   * (defaults to false)
   */
  showMaxLabel:false,

  /**
   * @cfg {Boolean} showRange Whether to show the range between the left- and rightmost thumbs in a special style
   * (defaults to false)
   */
  showRange:false,

  /**
   * @cfg {Boolean} showThumbLabels Whether to show a popup hint for the value of a thumb (defaults to false)
   */
  showThumbLabels:false,

  /**
   * @cfg {Number} value The value to initialize a single thumb to (defaults to 0)
   */
  value:0,

  /**
   * @cfg {Array} values The values to initialize each thumb with. One thumb will be created for each value.
   */
  values:[],

  /**
   * Disables the slider by calling the internal {@link #setThumbsDisabled} method
   */
  disable:function () {
    jep.field.Slider.superclass.disable.call(this);
    this.setThumbsDisabled(true);
  },

  /**
   * Enables the slider by calling the internal {@link #setThumbsDisabled} method.
   */
  enable:function () {
    jep.field.Slider.superclass.enable.call(this);
    this.setThumbsDisabled(false);
  },

  /**
   * Returns the current values of the Slider's thumbs
   * @return {Number} The thumb value
   */
  getValue:function () {
    return this.values[0];
  },

  /**
   * Returns the current values of the Slider's thumbs
   * @return {Number} The thumb value
   */
  getValues:function () {
    return this.values;
  },

  /**
   * Used to change the {@link getLabel} property
   * @param {Boolean} value The new value of getLabel
   */
  setGetLabel:function (fn) {
    this.getLabel = fn;

    this.updateThumbLabels();
    this.updateMinMaxLabels();
  },

  /**
   * Sets the {@link increment} value at runtime
   * @param {Number} newIncrement The new increment value
   */
  setIncrement:function (newIncrement) {
    if (this.increment !== newIncrement) {
      this.increment = newIncrement;

      this.updateSizes();
    }
  },

  /**
   * Sets {@link maxLabel} for the slider at runtime
   * @param {Boolean} value The new maxLabel
   */
  setMaxLabel:function (value) {
    if (value !== this.maxLabel) {
      this.maxLabel = value;

      this.updateMinMaxLabels();
      this.updateThumbLabels(); // in case a thumb is on this label
    }
  },

  /**
   * Sets the {@link maxValue} for the slider at runtime
   * @param {Number} value The new maxValue
   */
  setMaxValue:function (value) {
    if (this.maxValue !== value) {
      this.maxValue = value;

      this.updateSizes();
      this.updateMinMaxLabels();
    }
  },

  /**
   * Sets the {@link minDistance} for the slider at runtime
   * @param {Number} value The new minDistance
   */
  setMinDistance:function (value) {
    if (this.minDistance !== value) {
      this.minDistance = value;

      this.updateSizes();
    }
  },

  /**
   * Sets {@link minLabel} for the slider at runtime
   * @param {Boolean} value The new minLabel
   */
  setMinLabel:function (value) {
    if (value !== this.minLabel) {
      this.minLabel = value;

      this.updateMinMaxLabels();
      this.updateThumbLabels(); // in case a thumb is on this label
    }
  },

  /**
   * Sets the {@link minValue} for the slider at runtime
   * @param {Number} value The new minValue
   */
  setMinValue:function (value) {
    if (this.minValue !== value) {
      this.minValue = value;

      this.updateSizes();
      this.updateMinMaxLabels();
    }
  },

  /**
   * Sets the {@link showIncrements} for the slider at runtime
   * @param {Number} value The new showIncrements
   */
  setShowIncrements:function (value) {
    if (value !== this.showIncrements) {
      this.showIncrements = value;

      this.updateIncrementMarks();
    }
  },

  /**
   * Sets {@link showMinLabel} for the slider at runtime
   * @param {Boolean} value The new showMinLabel
   */
  setShowMinLabel:function (value) {
    if (value !== this.showMinLabel) {
      this.showMinLabel = value;

      this.updateMinMaxLabels();
    }
  },

  /**
   * Sets {@link showMaxLabel} for the slider at runtime
   * @param {Boolean} value The new showMaxLabel
   */
  setShowMaxLabel:function (value) {
    if (value !== this.showMaxLabel) {
      this.showMaxLabel = value;
      
      this.updateMinMaxLabels();
    }
  },

  /**
   * Sets the {@link showRange} for the slider at runtime
   * @param {Number} value The new showRange
   */
  setShowRange:function (value) {
    if (value !== this.showRange) {
      this.showRange = value;

      this.updateRange();
    }
  },

  /**
   * Used to change the {@link showThumbLabels} property
   * @param {Boolean} value The new value of showThumbLabels
   */
  setShowThumbLabels:function (value) {
    if (value !== this.showThumbLabels) {
      this.showThumbLabels = value;

      this.updateThumbLabels();
    }
  },

  /**
   * Sets the {@link minValue}, {@link maxValue}, {@link increment}, and {@link values}
   * for the slider at runtime, all at once.  Using this call, you can prevent the recalculations
   * that would normally occur when setting each variable independently.  It is also helpful to
   * avoid the settings being inconsistent (e.g. new minValue great than old maxValue)
   * @param {Number} minValue The new minValue
   * @param {Number} maxValue The new maxValue
   * @param {Number} increment The new increment
   * @param {Number} values The new values array
   */
  setup:function (minValue, maxValue, increment, values) {
    this.minValue = minValue;
    this.maxValue = maxValue;

    if (increment !== undefined) {
      this.increment = increment;
    }

    if (values !== undefined) {
      this.values = values;
    }

    this.updateSizes();
  },

  /**
   * Sets the new value of the slider, constraining it within {@link minValue} and {@link maxValue}, and snapping to the nearest
   * {@link increment} if set
   * @param {Number} value The new value
   * @param {Number} animationDuration Animation duration, 0 for no animation
   * @param {Boolean} moveThumb Whether or not to move the thumb as well. Defaults to true
   * @return {jep.field.Slider} this This Slider
   */
  setValue:function (value, animationDuration, moveThumb) {
    if (value === '') {
      value = this.values;
    }
    else {
      value = [value];
    }

    return this.setValues(value, animationDuration, moveThumb);
  },

  /**
   * Sets the new values of the slider, constraining them within {@link minValue} and {@link maxValue}, and snapping to the nearest
   * {@link increment} if set
   * @param {Array} values The new values of the thumbs
   * @param {Number} animationDuration Animation duration, 0 for no animation
   * @param {Boolean} moveThumb Whether or not to move the thumbs as well. Defaults to true
   * @return {jep.field.Slider} this This Slider
   */
  setValues:function (values, animationDuration, moveThumb) {
    if (values === undefined || values.length === 0) {
      values = [0];
    }

    moveThumb = !!moveThumb;

    this.values.splice(values.length);

    this.updateThumbs();  // necessary to resize thumbs array with create/destroy

    for (var i = 0; i < values.length; i++) {
      this.setValueTo(i, values[i], animationDuration, moveThumb);
    }

    this.updateSizes();

    return this;
  },

  /**
   * Sets the value at a particular index, constraining them within {@link minValue} and {@link maxValue},
   * and snapping to the nearest
   * {@link increment} if set
   * @param {Number} index The index of the thumb
   * @param {Array} value The new value of the thumb
   * @param {Number} animationDuration Animation duration, 0 for no animation
   * @param {Boolean} moveThumb Whether or not to move the thumbs as well. Defaults to true
   * @return {Number} The new value after constraints have been applied
   */
  setValueTo:function (index, value, animationDuration, moveThumb) {
    if (moveThumb === undefined) {
      moveThumb = true;
    }

    var thumb = this.getThumb(index);
    var oldValue = this.values[index];
    var newValue = this.constrain(index, value);

    if (thumb === undefined) {
      // a bit of a kludge for when you add thumbs
      newValue = this.constrain(index, value);
      thumb = this.initThumb(newValue);
      this.thumbs[index] = thumb;
      newValue = this.constrain(index, value);

      this.updateThumbLabel(thumb, newValue);
    }

    if (newValue === oldValue || this.fireEvent('beforechange', this, thumb, newValue, oldValue) !== false) {
      if (newValue !== oldValue) {
        this.values[index] = newValue;
        thumb.setValue(newValue);
      }

      if (this.rendered) {
        if (moveThumb) {
          this.moveThumb(thumb, this.getPixelValue(newValue), animationDuration);
        }
        this.updateRange();
        this.updateThumbLabel(thumb, newValue);
        this.updateIncrementMarks();
      }

      if (newValue !== oldValue) {
        this.fireEvent('change', this, thumb, newValue, oldValue);
      }
    }

    return newValue;
  },



  /** Following is stuff you don't normally need to change **/

  /**
   * @cfg {Boolean} monitorOrientation
   * Monitor Orientation change
   */
  monitorOrientation:true,

  renderTpl:[
    '<tpl if="label">',
    '<div class="x-form-label"><span>{label}</span></div>',
    '</tpl>',
    '<tpl if="fieldEl">',
    '<div id="{inputId}" name="{name}" class="{fieldCls}"',
    '<tpl if="tabIndex">tabIndex="{tabIndex}"</tpl>',
    '<tpl if="style">style="{style}" </tpl>',
    '/></tpl>'
  ],

  /**
   * @cfg {String} inputCls Overrides {@link Ext.form.Field}'s inputCls. Defaults to 'x-slider jep-slider'
   */
  inputCls:'x-slider jep-slider',

  inputType:'slider',

  ui:'slider',


  /** Private member variables and functions below this **/

  // @private
  thumbs:[],

  // @private
  rangeCmp:undefined,

  // @private
  incrementMarks:[],

  // @private
  minLabelCls:'jep-slider-min-label',

  // @private
  minLabelCmp:undefined,

  // @private
  maxLabelCls:'jep-slider-max-label',

  // @private
  maxLabelCmp:undefined,

  // @private
  rangeCls:'jep-slider-range',

  // @private
  thumbLabelCls:'jep-slider-thumb-label',

  // @private
  thumbLabelFirstCls:'jep-slider-thumb-label-first',

  // @private
  thumbLabelLastCls:'jep-slider-thumb-label-last',

  // @private
  incrementMarkCls:'jep-slider-increment-mark',

  // @private
  incrementRangeMarkCls:'jep-slider-increment-range-mark',

  // @private
  trackWidth:null,

  // @private
  thumbWidth:0,

  // @private
  drawnIncrement:0,

  // @private
  drawnIncrementPx:0,

  // @private
  actualMinDistance:0,

  // @private
  constructor:function (config) {
    this.addEvents(
        /**
         * @event beforechange
         * Fires before the value of a thumb is changed. Return false to cancel the change
         * @param {jep.field.Slider} slider The slider instance
         * @param {Ext.form.Slider.Thumb} thumb The thumb instance
         * @param {Number} newValue The value that the thumb will be set to
         * @param {Number} oldValue The previous value
         */
        'beforechange',

        /**
         * @event change
         * Fires when the value of a thumb is changed.
         * @param {jep.field.Slider} slider The slider instance
         * @param {Ext.form.Slider.Thumb} thumb The thumb instance
         * @param {Number} newValue The value that the thumb will be set to
         * @param {Number} oldValue The previous value
         */
        'change',
        /**
         * @event drag
         * Fires while the thumb is actively dragging.
         * @param {jep.field.Slider} slider The slider instance
         * @param {Ext.form.Slider.Thumb} thumb The thumb instance
         * @param {Number} value The value of the thumb.
         */
        'drag',
        /**
         * @event dragend
         * Fires when the thumb is finished dragging.
         * @param {jep.field.Slider} slider The slider instance
         * @param {Ext.form.Slider.Thumb} thumb The thumb instance
         * @param {Number} value The value of the thumb.
         */
        'dragend'
    );

    jep.field.Slider.superclass.constructor.call(this, config);
  },

  // @private
  resizeArray:function (array, newSize, createFn, destroyFn) {
    var i;

    var currentLength = array.length;

    // trim elements
    for (i = newSize; i < currentLength; i++) {
      destroyFn.call(this, array[i], i, array);
    }
    array.splice(newSize);

    // add more elements
    // start at end to resize array only once, in case the javascript engine tries to optimize
    // by using a non-sparse array implementation
    for (i = newSize - 1; i >= currentLength; i--) {
      array[i] = createFn.call(this, i);
    }
  },

  // @private
  initComponent:function () {
    this.tabIndex = -1;

    jep.field.Slider.superclass.initComponent.apply(this, arguments);
  },

  // @private
  initThumb:function (value) {
    var Thumb = this.getThumbClass();

    return new Thumb({
      renderTo:this.fieldEl,
      value:value,
      slider:this,

      listeners:{
        scope:this,
        drag:this.onDrag,
        dragend:this.onThumbDragEnd,
        afterrender:Ext.createDelegate(this.thumbRendered, this)
      }
    });
  },

  // @private
  thumbRendered:function (thumb) {
    if (this.thumbWidth !== thumb.getWidth()) {
      this.thumbWidth = thumb.getWidth();

      var me = this;
      setTimeout(function () {
        me.updateSizes();
      }, 100);
    }
  },

  // @private
  initValue:function () {
    if (this.values.length !== 0) {
      this.values = this.values.concat(); // unique array
    }
    else {
      this.values = [this.value];
    }

    this.thumbs = this.thumbs.concat(); // unique array
    this.incrementMarks = this.incrementMarks.concat(); // unique array

    if (this.increment == 0) {
      this.increment = 1;
    }

    this.increment = Math.abs(this.increment);
  },

  // @private
  getThumbClass:function () {
    return Ext.form.Slider.Thumb;
  },

  /**
   * @private
   * Takes a desired value of a thumb and returns the nearest snap value. e.g if minValue = 0, maxValue = 100, increment = 10 and we
   * pass a value of 67 here, the returned value will be 70. The returned number is constrained within {@link minValue} and {@link maxValue},
   * so in the above example 68 would be returned if {@link maxValue} was set to 68.  Also snaps it to within an increment away from
   * its neighboring thumb.
   * @param {Number} thumbIndex The index of the thumb to snap
   * @param {Number} value The value to snap
   * @return {Number} The snapped value
   */
  constrain:function (thumbIndex, value, skipNeighborCheck) {
    var remainder = value % this.increment;

    value -= remainder;

    if (Math.abs(remainder) >= (this.increment / 2)) {
      value += (remainder > 0) ? this.increment : -this.increment;
    }

    value = Math.max(this.minValue, value);
    value = Math.min(this.maxValue, value);

    if (skipNeighborCheck !== true) {
      // we use values[] instead of thumbs[] because this code gets called sometimes when thumbs has yet to be synced

      // check against thumb to the left
      if (thumbIndex !== 0) {
        value = Math.max(value, this.values[thumbIndex - 1] + this.actualMinDistance);
        value = Math.min(this.maxValue, value);
      }

      // check against thumb to the right
      if (thumbIndex !== this.values.length - 1) {
        value = Math.min(value, this.values[thumbIndex + 1] - this.actualMinDistance);
        value = Math.max(this.minValue, value);
      }
    }

    return value;
  },

  /**
   * @private
   * Returns the Thumb instance bound to this Slider
   * @param {Number} index The index of the thumb
   * @return {Ext.form.Slider.Thumb} The thumb instance
   */
  getThumb:function (index) {
    return this.thumbs[index];
  },

  /**
   * @private
   */
  getThumbs:function () {
    return this.thumbs;
  },

  /**
   * @private
   * Returns the index for a given Thumb object
   * @param {Ext.form.Slider.Thumb} thumb The thumb instance
   * @return {Number} The index of the thumb or -1 if not found
   */
  indexOfThumb:function (thumb) {
    return this.thumbs.indexOf(thumb);
  },

  // @private
  updateMinMaxLabels:function () {
    var label;

    if (this.showMinLabel) {
      label = this.minLabel !== undefined ? this.minLabel : this.getLabel(this, this.minValue, true).toString();

      if (this.minLabelCmp === undefined) {
        this.minLabelCmp = new Ext.Component({
          cls:this.minLabelCls,
          renderTo:this.fieldEl,
          html:label
        })
      }
      else {
        this.minLabelCmp.update(label);
      } 
    }
    else if (this.minLabelCmp !== undefined) {
      this.minLabelCmp.destroy();
      this.minLabelCmp = undefined;
    }

    if (this.showMaxLabel) {
      label = this.maxLabel !== undefined ? this.maxLabel : this.getLabel(this, this.maxValue, true).toString();

      if (this.maxLabelCmp === undefined) {
        this.maxLabelCmp = new Ext.Component({
          cls:this.maxLabelCls,
          renderTo:this.fieldEl,
          html:label
        })
      }
      else {
        this.maxLabelCmp.update(label);
      } 
    }
    else if (this.maxLabelCmp !== undefined) {
      this.maxLabelCmp.destroy();
      this.maxLabelCmp = undefined;
    }
  },

  // @private
  updateSizes:function () {
    var trackWidth = this.trackWidth;
    var thumbWidth = this.thumbWidth;
    var drawnIncrement = this.drawnIncrement;
    var drawnIncrementPx = this.drawnIncrementPx;
    var incrementCount = this.incrementCount;

    if (this.thumbs[0] !== undefined && this.thumbs[0].rendered) {
      this.thumbWidth = this.thumbs[0].getWidth();
    }

    if (this.thumbWidth === 0) {
      this.updateThumbs();
    }

    if (this.thumbWidth !== 0) {
      if (this.fieldEl !== undefined) {
        this.trackWidth = this.fieldEl.getWidth() - this.thumbWidth;
      }

      this.drawnIncrement = Ext.isNumber(this.showIncrements) ? this.showIncrements : this.increment;
      this.drawnIncrementPx = this.getPixelValue(this.minValue + this.drawnIncrement);
      this.actualMinDistance = this.minDistance === undefined ? this.increment : this.minDistance;

      this.incrementCount = this.drawnIncrement === 0 ? 0 :
          Math.ceil((this.maxValue - this.minValue) / this.drawnIncrement) - 1;

      if (!Ext.is.Desktop // seems to need forcing more on non-desktop environments
          || trackWidth !== this.trackWidth
          || thumbWidth !== this.thumbWidth
          || drawnIncrement !== this.drawnIncrement
          || drawnIncrementPx !== this.drawnIncrementPx
          || incrementCount !== this.incrementCount) {
        this.updateThumbs();
        this.updateThumbLabels();
        this.updateIncrementMarks();
        this.updateRange();
      }
    }
  },

  // @private
  updateThumbs:function () {
    this.resizeArray(this.thumbs, this.values.length,
        function (i) {
          return this.initThumb(this.values[i]);
        },
        function (obj) {
          obj.destroy();
        });

    for (var i = 0; i < this.thumbs.length; i++) {
      var thumb = this.thumbs[i];
      var value = this.values[i];

      if (thumb.value !== value) {
        thumb.setValue(value);
      }

      this.updateThumbLabel(thumb);

      var x = this.getPixelValue(value);
      if (thumb.rendered && thumb.dragObj.getOffset().x !== value) {
        thumb.dragObj.setOffset(new Ext.util.Offset(x, 0), false);
      }
    }
  },

  // @private
  updateThumbLabel:function (thumb) {
    if (this.showThumbLabels) {
      var value = this.values[this.thumbs.indexOf(thumb)];

      var style = {width:this.drawnIncrementPx + 'px', left:null, right:null};

      if (value !== undefined) {
        if (thumb.sliderLabel !== undefined && thumb.rendered) {
          var left;
          var cls;

          var x = this.getPixelValue(value);

          if (value === this.minValue) {
            cls = this.thumbLabelFirstCls;
            style.left = 0;
          }
          else if (value === this.maxValue) {
            cls = this.thumbLabelLastCls;
            style.right = 0;
          }
          else {
            cls = '';
            style.left = (x - this.drawnIncrementPx / 2 + this.thumbWidth / 2) + 'px';
          }
        }

        if (thumb.sliderLabel === undefined) {
          thumb.sliderLabel = new Ext.Component({
            renderTo:this.fieldEl,
            cls:this.thumbLabelCls
          });
        }
        else {
          thumb.sliderLabel.removeCls(this.thumbLabelFirstCls);
          thumb.sliderLabel.removeCls(this.thumbLabelLastCls);
          thumb.sliderLabel.addCls(cls);
        }

        thumb.sliderLabel.el.applyStyles(style);

        var label;
        if ((!this.showMinLabel || value !== this.minValue)
            && (!this.showMaxLabel || value !== this.maxValue)) {
          label = this.getLabel(this, value, false).toString();
        }
        else {
          label = '';
        }

        thumb.sliderLabel.update(label);
      }
    }
    else if (thumb.sliderLabel !== undefined) {
      thumb.sliderLabel.destroy();
      thumb.sliderLabel = undefined;
    }
  },

  // @private
  updateThumbLabels:function () {
    for (var i = 0; i < this.thumbs.length; i++) {
      this.updateThumbLabel(this.thumbs[i]);
    }
  },

  // @private
  updateRange:function () {
    if (this.showRange) {
      if (this.rangeCmp === undefined) {
        this.rangeCmp = new Ext.Component({
          renderTo:this.fieldEl,
          cls:this.rangeCls
        });
      }

      if (this.rangeCmp.rendered) {
        var left = this.getPixelValue(this.values[0]) + this.thumbWidth / 2;
        var right = this.getPixelValue(this.values[this.values.length - 1]) - this.thumbWidth / 2;

        var style = {left:left + 'px', right:(this.trackWidth - right) + 'px'};
        this.rangeCmp.el.applyStyles(style);
      }
    }
    else {
      if (this.rangeCmp !== undefined) {
        this.rangeCmp.destroy();
        this.rangeCmp = undefined;
      }
    }
  },

  // @private
  updateIncrementMarks:function () {
    if (this.showIncrements) {
      var i;

      this.resizeArray(this.incrementMarks, this.incrementCount,
          function () {
            return new Ext.Component({
                  renderTo:this.fieldEl,
                  cls:this.incrementMarkCls
                });
          },

          function (obj) {
            obj.destroy();
          });

      for (i = 0; i < this.incrementMarks.length; i++) {
        var value = this.minValue + this.drawnIncrement * (i + 1);
        var left = this.getPixelValue(value);

        this.incrementMarks[i].el.applyStyles({left:left + 'px'});

        if (this.showRange
            && this.values.length > 1
            && value > this.values[0]
            && value < this.values[this.values.length - 1]) {
          this.incrementMarks[i].addCls(this.incrementRangeMarkCls);
        }
        else {
          this.incrementMarks[i].removeCls(this.incrementRangeMarkCls);
        }
      }
    }
    else {
      this.resizeArray(this.incrementMarks, 0,
          undefined,
          function (obj) {
            obj.destroy();
          });
    }
  },

  /**
   * @private
   * Maps a pixel value to a slider value. If we have a slider that is 200px wide, where minValue is 100 and maxValue is 500,
   * passing a pixelValue of 38 will return a mapped value of 176
   * @param {Number} pixelValue The pixel value, relative to the left edge of the slider
   * @return {Number} The value based on slider units
   */
  getSliderValue:function (pixelValue) {
    var range = this.maxValue - this.minValue;
    var ratio;

    ratio = range / this.trackWidth;

    return this.minValue + (ratio * (pixelValue));
  },

  /**
   * @private
   * might represent), this returns the pixel on the rendered slider that the thumb should be positioned at
   * @param {Number} value The internal slider value
   * @return {Number} The pixel value, rounded and relative to the left edge of the scroller
   */
  getPixelValue:function (value) {
    var range = this.maxValue - this.minValue;
    var ratio;

    ratio = this.trackWidth / range;

    return (ratio * (value - this.minValue));
  },

  /**
   * @private
   * Get the value for a draggable thumb.
   */
  getThumbValue:function (draggable) {
    return this.getSliderValue(-draggable.getOffset().x, draggable.thumb);
  },

  // @private
  onOrientationChange:function () {
    jep.field.Slider.superclass.onOrientationChange.apply(this, arguments);

    // another one of those places why I have no idea why, but iOS and android
    // seem to require lots of extra nudging to get the drawing right
    if (!Ext.is.Desktop) {
      var me = this;

      setTimeout(function () {
        me.updateSizes();
        me.updateSizes();
      }, 100);
    }
  },

  /**
   * @private
   * Fires drag events so the user can interact.
   */
  onDrag:function (draggable) {
    var value = this.setValueTo(this.thumbs.indexOf(draggable.thumb), this.getThumbValue(draggable));

    this.fireEvent('drag', this, draggable.thumb, value);

    // No idea why, but iOS seems to fail to redraw the screen on the first update, and
    // a second asynchronous one is required.  And you can't just get around it by making the first
    // update asynchronous.
    if (Ext.is.iOS) {
      setTimeout(function () {
        me.updateThumbLabel(thumb);
        me.updateIncrementMarks();
        me.updateRange();
        }, 100);
    }
  },

  /**
   * @private
   * Updates a thumb after it has been dragged
   */
  onThumbDragEnd:function (draggable) {
    var value = this.setValueTo(this.thumbs.indexOf(draggable.thumb), this.getThumbValue(draggable));

    this.fireEvent('dragend', this, draggable.thumb, value);
  },

  /**
   * @private
   * Updates the value of the nearest thumb on tap events
   */
  onTap:function (e) {
    if (!this.disabled) {
      var sliderBox = this.fieldEl.getPageBox(),
          leftOffset = e.pageX - sliderBox.left,
          thumb = this.getNearest(leftOffset),
          halfThumbWidth = this.thumbWidth / 2;

      var value = this.getSliderValue(leftOffset - halfThumbWidth);

      var me = this;
      value = me.setValueTo(me.thumbs.indexOf(thumb), value, thumb,
          me.animationDuration);

      // No idea why, but iOS seems to fail to redraw the screen on the first update, and
      // a second asynchronous one is required.  And you can't just get around it by making the first
      // update asynchronous.
      if (Ext.is.iOS) {
        setTimeout(function () {
          me.updateThumbLabel(thumb);
          me.updateIncrementMarks();
          me.updateRange();
          }, 100);
      }
    }
  },

  /**
   * @private
   * Moves the thumb element. Should only ever need to be called from within {@link setValue}
   * @param {Ext.form.Slider.Thumb} thumb The thumb to move
   * @param {Number} pixel The pixel the thumb should be centered on
   * @param {Boolean} animationDuration True to animationDuration the movement
   */
  moveThumb:function (thumb, pixel, animationDuration) {
    if (thumb.rendered) {
      thumb.dragObj.setOffset(new Ext.util.Offset(pixel, 0), animationDuration);
    }
  },

  // @private
  afterRender:function (ct) {
    var me = this;

    jep.field.Slider.superclass.afterRender.apply(this, arguments);

    this.fieldEl.on({
      scope:me,
      tap:me.onTap
    });

    setTimeout(function () {
      me.updateSizes();
      me.updateMinMaxLabels();
    }, 100);
  },

  /**
   * @private
   * Finds and returns the nearest {@link Ext.form.Slider.Thumb thumb} to the given pixel offset value.
   * @param {Number} value The pixel offset value
   * @return {Ext.form.Slider.Thumb} The nearest thumb
   */
  getNearest:function (value) {
    var closestThumb;
    var closestDistance = -1;

    for (var i = 0; i < this.thumbs.length; i++) {
      var thisDistance = Math.abs(this.thumbs[i].dragObj.offset.x - value);
      if (closestThumb === undefined || thisDistance < closestDistance) {
        closestThumb = this.thumbs[i];
        closestDistance = Math.abs(this.thumbs[i].dragObj.offset.x - value);
      }
    }

    return closestThumb;
  },

  /**
   * @private
   * Loops through each of the sliders {@link #thumbs} and calls disable/enable on each of them depending
   * on the param specified.
   * @param {Boolean} disable True to disable, false to enable
   */
  setThumbsDisabled:function (disable) {
    var thumbs = this.thumbs,
        ln = thumbs.length,
        i = 0;

    for (; i < ln; i++) {
      thumbs[i].dragObj[disable ? 'disable' : 'enable']();
    }
  }

});
Ext.reg('jepsliderfield', jep.field.Slider);
