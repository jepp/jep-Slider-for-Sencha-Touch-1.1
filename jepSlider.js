Ext.namespace("jep.field");
jep.field.Slider = Ext.extend(Ext.form.Field, {
    ui: 'slider',
    /**
     * @cfg {Boolean} useClearIcon @hide
     */

    /**
     * @cfg {String} inputCls Overrides {@link Ext.form.Field}'s inputCls. Defaults to 'x-slider'
     */
    inputCls: 'x-slider',

    inputType: 'slider',

    /**
     * @cfg {Number} minValue The lowest value any thumb on this slider can be set to (defaults to 0)
     */
    minValue: 0,

    /**
     * @cfg {Number} maxValue The highest value any thumb on this slider can be set to (defaults to 100)
     */
    maxValue: 100,

    /**
     * @cfg {Number} animationDuration When set to a number greater than 0, it will be the animation duration in ms, defaults to 200
     */
    animationDuration: 200,

    /**
     * @cfg {Number} value The value to initialize a single thumb to (defaults to 0)
     */
    value: 0,

    /**
     * @cfg {Array} values The values to initialize each thumb with. One thumb will be created for each value. This configuration
     * should always be defined but if it is not then it will be treated as though [0] was passed.
     */
    values: [0],

    /**
     * @private
     * @cfg {Number} trackWidth The current track width. Used when the field is hidden so setValue will continue to work (needs
     * the fieldEls width).
     */
    trackWidth: null,

    monitorOrientation: true,

    renderTpl: [
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
     * @cfg {Number} increment The increment by which to snap each thumb when its value changes. Defaults to 1. Any thumb movement
     * will be snapped to the nearest value that is a multiple of the increment (e.g. if increment is 10 and the user tries to move
     * the thumb to 67, it will be snapped to 70 instead)
     */
    increment: 1,


    /**
     * @cfg {Number} minRange The minimum range to snap a thumb to relative to its neighbor.  This is the minimum amount
     * of distance between two thumbs when multiple thumbs are used.  When omitted, the minimum range is equal to one
     * increment value.  To allow thumbs to be set to the same value, use a value of 0
     */
    minRange: undefined,

    // @private
    constructor: function(config) {
        this.addEvents(
            /**
             * @event beforechange
             * Fires before the value of a thumb is changed. Return false to cancel the change
             * @param {Ext.form.Slider} slider The slider instance
             * @param {Ext.form.Slider.Thumb} thumb The thumb instance
             * @param {Number} newValue The value that the thumb will be set to
             * @param {Number} oldValue The previous value
             */
            'beforechange',

            /**
             * @event change
             * Fires when the value of a thumb is changed.
             * @param {Ext.form.Slider} slider The slider instance
             * @param {Ext.form.Slider.Thumb} thumb The thumb instance
             * @param {Number} newValue The value that the thumb will be set to
             * @param {Number} oldValue The previous value
             */
            'change',
            /**
             * @event drag
             * Fires while the thumb is actively dragging.
             * @param {Ext.form.Slider} slider The slider instance
             * @param {Ext.form.Slider.Thumb} thumb The thumb instance
             * @param {Number} value The value of the thumb.
             */
            'drag',
            /**
             * @event dragend
             * Fires when the thumb is finished dragging.
             * @param {Ext.form.Slider} slider The slider instance
             * @param {Ext.form.Slider.Thumb} thumb The thumb instance
             * @param {Number} value The value of the thumb.
             */
            'dragend'
        );

        Ext.form.Slider.superclass.constructor.call(this, config);
    },

    // @private
    initComponent: function() {
        this.tabIndex = -1;

        if (this.increment == 0) {
            this.increment = 1;
        }

        this.increment = Math.abs(this.increment);

        Ext.form.Slider.superclass.initComponent.apply(this, arguments);

        if (this.thumbs == undefined) {
            var thumbs = [],
                values = this.values,
                length = values.length,
                i;

            for (i = 0; i < length; i++) {
                thumbs[thumbs.length] = this.initThumb(values[i]);
            }

            this.thumbs = thumbs;
        }
    },

    // @private
    initThumb: function(value) {
      var Thumb = this.getThumbClass();
        return new Thumb({
            value: value,
            slider: this,

            listeners: {
                scope  : this,
                drag   : this.onDrag,
                dragend: this.onThumbDragEnd
            }
        });
    },

    // @private
    initValue: function() {
      for (var i = 0; i < this.values.length; i++) {
        var thumb = this.getThumb(i);

        if (thumb.dragObj) {
            thumb.dragObj.updateBoundary();
        }

        //Ext.form.Slider.superclass.initValue.apply(this, arguments);
        // don't like animation on init value
        this.setValue(this.value || "");

        /**
         * The original value of the field as configured in the {@link #value} configuration, or
         * as loaded by the last form load operation if the form's {@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
         * setting is <code>true</code>.
         * @type mixed
         * @property originalValue
         */
        this.originalValue = this.getValue();
      }
    },

    onOrientationChange: function() {
        Ext.form.Slider.superclass.onOrientationChange.apply(this, arguments);

        var me = this;

        for (var i = 0; i < this.values.length; i++) {
            var thumb = this.getThumb(i);
            if (thumb.dragObj) {
                setTimeout(function(thumb) {
                    thumb.dragObj.updateBoundary();
                    me.moveThumb(thumb, me.getPixelValue(thumb.getValue(), thumb), 0);
                }, 100, thumb);
            }
        }
    },

    getThumbClass: function() {
        return Ext.form.Slider.Thumb;
    },

    /**
     * Sets the new value of the slider, constraining it within {@link minValue} and {@link maxValue}, and snapping to the nearest
     * {@link increment} if set
     * @param {Number} value The new value
     * @param {Number} animationDuration Animation duration, 0 for no animation
     * @param {Boolean} moveThumb Whether or not to move the thumb as well. Defaults to true
     * @return {Ext.form.Slider} this This Slider
     */
    setValue: function(value, animationDuration, moveThumb) {
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
     * @return {Ext.form.Slider} this This Slider
     */
    setValues: function(values, animationDuration, moveThumb) {
        if (values === undefined || values.length === 0) {
          values = [0];
        }

        if (typeof moveThumb == 'undefined') {
            moveThumb = true;
        }

        moveThumb = !!moveThumb;

        var oldValues = this.values;

        // get rid of extra thumbs
        for (var i = values.length; i < this.thumbs.length; i++) {
            this.thumbs[i].destroy();
        }
        this.thumbs.splice(values.length);

        for (i = 0; i < values.length; i++) {
            var thumb    = this.getThumb(i),
                oldValue = oldValues[i],
                newValue = this.constrain(i, values[i]);

            if (thumb === undefined) {
              // a bit of a kludge for when you add thumbs
              newValue = this.constrain(i, values[i]);
              thumb = this.initThumb(newValue);
              this.thumbs[i] = thumb;
              this.renderThumbs();
              newValue = this.constrain(i, values[i]);
            }

            if (newValue === oldValue || this.fireEvent('beforechange', this, thumb, newValue, oldValue) !== false) {
                if (moveThumb) {
                    this.moveThumb(thumb, this.getPixelValue(newValue, thumb), animationDuration);
                }

                if (newValue !== oldValue) {
                    this.values[i] = newValue;
                    thumb.setValue(newValue);
                    this.doComponentLayout();

                    this.doChange(thumb, newValue, oldValue);
                }
            }
        }

        return this;

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
    constrain: function(thumbIndex, value) {
        var remainder = value % this.increment;

        value -= remainder;

        if (Math.abs(remainder) >= (this.increment / 2)) {
            value += (remainder > 0) ? this.increment : -this.increment;
        }

        value = Math.max(this.minValue, value);
        value = Math.min(this.maxValue, value);

        // check again thumb to the left
        if (thumbIndex !== 0) {
            value = Math.max(value, this.values[thumbIndex - 1] + (this.minRange === undefined ? this.increment : this.minRange));
        }

        // check again thumb to the right
        if (thumbIndex !== this.thumbs.length - 1) {
            value = Math.min(value, this.values[thumbIndex + 1] - (this.minRange === undefined ? this.increment : this.minRange));
        }

        return value;
    },

    /**
     * Returns the current values of the Slider's thumbs
     * @return {Number} The thumb value
     */
    getValue: function() {
      return this.values[0];
    },

    /**
     * Returns the current values of the Slider's thumbs
     * @return {Number} The thumb value
     */
    getValues: function() {
      return this.values;
    },

    /**
     * Returns the Thumb instance bound to this Slider
     * @param {Number} index The index of the thumb
     * @return {Ext.form.Slider.Thumb} The thumb instance
     */
    getThumb: function(index) {
        return this.thumbs[index];
    },

    /**
     * @private
     */
    getThumbs: function() {
        return this.thumbs;
    },

    /**
     * Returns the index for a given Thumb object
     * @param {Ext.form.Slider.Thumb} thumb The thumb instance
     * @return {Number} The index of the thumb or -1 if not found
     */
    indexOfThumb: function(thumb) {
        return this.thumbs.indexOf(thumb);
    },

    /**
     * @private
     * Maps a pixel value to a slider value. If we have a slider that is 200px wide, where minValue is 100 and maxValue is 500,
     * passing a pixelValue of 38 will return a mapped value of 176
     * @param {Number} pixelValue The pixel value, relative to the left edge of the slider
     * @return {Number} The value based on slider units
     */
    getSliderValue: function(pixelValue, thumb) {
        var trackWidth = thumb.dragObj.offsetBoundary.right,
            range = this.maxValue - this.minValue,
            ratio;

        this.trackWidth = (trackWidth > 0) ? trackWidth : this.trackWidth;
        ratio = range / this.trackWidth;

        return this.minValue + (ratio * (pixelValue));
    },

    /**
     * @private
     * might represent), this returns the pixel on the rendered slider that the thumb should be positioned at
     * @param {Number} value The internal slider value
     * @return {Number} The pixel value, rounded and relative to the left edge of the scroller
     */
    getPixelValue: function(value, thumb) {
        var trackWidth = thumb.dragObj.offsetBoundary.right,
            range = this.maxValue - this.minValue,
            ratio;

        this.trackWidth = (trackWidth > 0) ? trackWidth : this.trackWidth;
        ratio = this.trackWidth / range;

        return (ratio * (value - this.minValue));
    },

    /**
     * @private
     * Creates an Ext.form.Slider.Thumb instance for each configured {@link values value}. Assumes that this.el is already present
     */
    renderThumbs: function() {
        var thumbs = this.thumbs,
            length = thumbs.length,
            i;

        for (i = 0; i < length; i++) {
            thumbs[i].render(this.fieldEl);
        }
    },

    /**
     * @private
     * Updates a thumb after it has been dragged
     */
    onThumbDragEnd: function(draggable) {
        var value = this.setThumbValue(draggable, this.getThumbValue(draggable));

        this.fireEvent('dragend', this, draggable.thumb, value);
    },

    /**
     * @private
     * Set the value for a draggable thumb.
     */
    setThumbValue: function(draggable, value) {
        var thumbIndex = this.thumbs.indexOf(draggable.thumb);
        var newValue = this.constrain(thumbIndex, value);
        var oldValue = this.values[thumbIndex];

        if (this.fireEvent('beforechange', this, draggable.thumb, newValue, oldValue) !== false) {
            this.values[thumbIndex] = newValue;
        }
        else {
            newValue = oldValue;
        }

        if (newValue !== value) {
            draggable.thumb.setValue(newValue);
            draggable.thumb.dragObj.setOffset(new Ext.util.Offset(this.getPixelValue(newValue, draggable.thumb), 0), false);
        }

        if (newValue !== oldValue) {
            this.doChange(draggable.thumb, newValue, oldValue);
        }

        return newValue;
    },

    doChange:function (thumb, newValue, oldValue) {
        this.fireEvent('change', this, thumb, newValue, oldValue);
    },

    /**
     * @private
     * Get the value for a draggable thumb.
     */
    getThumbValue: function(draggable) {
        var thumb = draggable.thumb;

        return this.getSliderValue(-draggable.getOffset().x, thumb);
    },

    /**
     * @private
     * Fires drag events so the user can interact.
     */
    onDrag: function(draggable){
        var value = this.setThumbValue(draggable, this.getThumbValue(draggable));

        this.fireEvent('drag', this, draggable.thumb, value);
    },

    /**
     * @private
     * Updates the value of the nearest thumb on tap events
     */
    onTap: function(e) {
        if (!this.disabled) {
            var sliderBox = this.fieldEl.getPageBox(),
                leftOffset = e.pageX - sliderBox.left,
                thumb = this.getNearest(leftOffset),
                halfThumbWidth = thumb.dragObj.size.width / 2;

            var newValues = this.values.concat();
            newValues[this.thumbs.indexOf(thumb)] = this.getSliderValue(leftOffset - halfThumbWidth, thumb);

            this.setValues(newValues, this.animationDuration, true);
        }
    },

    /**
     * @private
     * Moves the thumb element. Should only ever need to be called from within {@link setValue}
     * @param {Ext.form.Slider.Thumb} thumb The thumb to move
     * @param {Number} pixel The pixel the thumb should be centered on
     * @param {Boolean} animationDuration True to animationDuration the movement
     */
    moveThumb: function(thumb, pixel, animationDuration) {
        thumb.dragObj.setOffset(new Ext.util.Offset(pixel, 0), animationDuration);
    },

    // inherit docs
    afterRender: function(ct) {
        var me = this;

        me.renderThumbs();

        Ext.form.Slider.superclass.afterRender.apply(me, arguments);

        me.fieldEl.on({
            scope: me,
            tap  : me.onTap
        });
    },

    /**
     * @private
     * Finds and returns the nearest {@link Ext.form.Slider.Thumb thumb} to the given pixel offset value.
     * @param {Number} value The pixel offset value
     * @return {Ext.form.Slider.Thumb} The nearest thumb
     */
    getNearest: function(value) {
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
    setThumbsDisabled: function(disable) {
        var thumbs = this.thumbs,
            ln     = thumbs.length,
            i      = 0;

        for (; i < ln; i++) {
            thumbs[i].dragObj[disable ? 'disable' : 'enable']();
        }
    },

    /**
     * Disables the slider by calling the internal {@link #setThumbsDisabled} method
     */
    disable: function() {
        Ext.form.Slider.superclass.disable.call(this);
        this.setThumbsDisabled(true);
    },

    /**
     * Enables the slider by calling the internal {@link #setThumbsDisabled} method.
     */
    enable: function() {
        Ext.form.Slider.superclass.enable.call(this);
        this.setThumbsDisabled(false);
    }
});
Ext.reg('jepsliderfield', jep.field.Slider);



jep.field.RangeSlider = Ext.extend(jep.field.Slider, {
  inputCls:'x-slider jep-range-slider',
  /**
   * @private
   */
  rangeCmp:[],

  initComponent:function () {
    jep.field.RangeSlider.superclass.initComponent.apply(this, arguments);

    this.rangeCmp = new Ext.Component({
      cls:'jep-slider-range-box'
    });
  },

  doChange:function (slider, thumb, newValue, oldValue) {
    jep.field.RangeSlider.superclass.doChange.apply(this, arguments);

    this.updateRange();
  },

  /*
   * @private
   */
  updateRange:function () {
    var last = this.thumbs.length - 1;
    if (last >= 1) {
      var left = this.getPixelValue(this.thumbs[0].getValue(), this.thumbs[0]) +
          this.thumbs[0].dragObj.size.width / 2;
      var right = this.getPixelValue(this.thumbs[last].getValue(), this.thumbs[last]) -
          this.thumbs[last].dragObj.size.width / 2;

      this.rangeCmp.el.applyStyles({left:left, right:this.trackWidth - right});
    }
  },

  onOrientationChange: function() {
    jep.field.RangeSlider.superclass.onOrientationChange.apply(this, arguments);

    var me = this;
    setTimeout(function () { me.updateRange() }, 101); // after setTimeout in superclass
  },

  afterRender: function(ct) {
    this.rangeCmp.render(this.fieldEl);

    jep.field.RangeSlider.superclass.afterRender.apply(this, arguments);
  },

  initValue: function() {
    jep.field.RangeSlider.superclass.initValue.apply(this, arguments);

    this.updateRange();
  }
});
Ext.reg('jeprangesliderfield', jep.field.RangeSlider);