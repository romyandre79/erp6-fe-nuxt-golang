import { useI18n } from '#imports';

export function useFormValidation() {
  const { t } = useI18n();

  function validateField(component: any, value: any) {
    if (!component.validated || !Array.isArray(component.validated)) return true;
    let message = '';

    for (const rule of component.validated) {
      const [ruleName, ruleValue] = rule.split(':');

      switch (ruleName.toLowerCase()) {
        case 'empty':
          if (value === null || value === undefined || value === '')
            message = t(`INVALID_ENTRY_EMPTY`, { entry: component.props.ext || component.props.key });
          break;

        case 'number':
          if (value !== '' && isNaN(Number(value)))
            message = t(`INVALID_ENTRY_NUMBER`, { entry: component.props.text || component.props.key });
          break;

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase()))
            message = t(`INVALID_ENTRY_EMAIL`, { entry: component.props.text || component.props.key });
          break;

        case 'min':
          if (value !== undefined && value !== null && value !== '') {
            if (!isNaN(Number(value))) {
              if (Number(value) < Number(ruleValue))
                message = t(`INVALID_ENTRY_MIN`, {
                  entry: component.props.text || component.props.key,
                  value: ruleValue,
                });
            } else if (String(value).length < Number(ruleValue))
              message = t(`INVALID_ENTRY_MIN_CHAR`, {
                entry: component.props.text || component.props.key,
                value: ruleValue,
              });
          }
          break;

        case 'max':
          if (value !== undefined && value !== null && value !== '') {
            if (!isNaN(Number(value))) {
              if (Number(value) > Number(ruleValue))
                message = t(`INVALID_ENTRY_MAX`, {
                  entry: component.props.text || component.props.key,
                  value: ruleValue,
                });
            } else if (String(value).length < Number(ruleValue))
              message = t(`INVALID_ENTRY_MAX_CHAR`, {
                entry: component.props.text || component.props.key,
                value: ruleValue,
              });
          }
          break;

        case 'regex':
          try {
            const pattern = new RegExp(ruleValue);
            if (!pattern.test(String(value || '')))
              message = t(`INVALID_ENTRY_FORMAT`, { entry: component.props.text || component.props.key });
          } catch {
            console.warn('Invalid regex:', ruleValue);
          }
          break;
      }

      if (message) return message;
    }

    return true;
  }

  return {
    validateField,
  };
}
