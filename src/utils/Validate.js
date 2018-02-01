export default class Validate {
  /**
   * 验证必填元素
   */
  static required(value) {
    if (typeof value === 'number') {
      value = value.toString()
    } else if (typeof value === 'boolean') {
      return !0
    }

    return value && value.length > 0
  }

  /**
   * 重复验证
   */
  static noDuplicate(values) {
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (values[i] == values[j] && i != j) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * 验证电子邮箱格式
   */
  static email(value) {
    return this.optional(value) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
  }
  /**
   * 验证手机格式
   */
  static tel(value) {
    return this.optional(value) || /^1[34578]\d{9}$/.test(value)
  }
  /**
   * 验证URL格式
   */
  static url(value) {
    return this.optional(value) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
  }
  /**
   * 验证日期格式
   */
  static date(value) {
    return this.optional(value) || !/Invalid|NaN/.test(new Date(value).toString())
  }
  /**
   * 验证ISO类型的日期格式
   */
  static dateISO(value) {
    return this.optional(value) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
  }
  /**
   * 验证十进制数字
   */
  static number(value) {
    return this.optional(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
  }
  /**
   * 验证整数
   */
  static digits(value) {
    return this.optional(value) || /^\d+$/.test(value)
  }
  /**
   * 验证身份证号码
   */
  static idcard(value) {
    return this.optional(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
  }
  /**
   * 验证两个输入框的内容是否相同
   */
  static equalTo(value, param) {
    return this.optional(value) || value === that.scope.detail.value[param]
  }
  /**
   * 验证是否包含某个值
   */
  static contains(value, param) {
    return this.optional(value) || value.indexOf(param) >= 0
  }
  /**
   * 验证最小长度
   */
  static minlength(value, param) {
    return this.optional(value) || value.length >= param
  }
  /**
   * 验证最大长度
   */
  static maxlength(value, param) {
    return this.optional(value) || value.length <= param
  }
  /**
   * 验证一个长度范围[min, max]
   */
  static rangelength(value, param) {
    return this.optional(value) || (value.length >= param[0] && value.length <= param[1])
  }
  /**
   * 验证最小值
   */
  static min(value, param) {
    return this.optional(value) || Number(value) >= Number(param);
  }
  /**
   * 验证最大值
   */
  static max(value, param) {
    return this.optional(value) || Number(value) <= Number(param);
  }

  /**
   * 验证时间
   */
  static after(value, param) {
    return this.optional(value) || value >= param;
  }
  /**
   * 验证时间
   */
  static before(value, param) {
    return this.optional(value) || value <= param;
  }

  /**
   * 验证一个值范围[min, max]
   */
  static range(value, param) {
    return this.optional(value) || (value >= param[0] && value <= param[1])
  }
  /**
   * 判断输入值是否为空
   */
  static optional(value) {
    return !this.required(value) && 'dependency-mismatch'
  }

  /***
   * 验证金额
   */
  static money(value) {
    return this.optional(value) || /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)
  }
}
