import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import { TextField } from 'redux-form-material-ui';
import { Field } from 'redux-form';
import timezones from '../../consts/timezones';

const suggestions = timezones.map(zone => ({
  label: zone
}));

function renderInput(inputProps) {
  const {
    classes,
    value,
    ...other
  } = inputProps;

  return (
    <Field
      component={TextField}
      label="Timezone"
      type="text"
      placeholder="Search a Timezone"
      margin="normal"
      name="timezone"
      fullWidth
      InputProps={{
        classes: {
          input: classes.input
        },
        value,
        ...other
      }}
    />
  );
}

function renderSuggestion(params) {
  const {
    suggestion,
    index,
    itemProps,
    theme,
    highlightedIndex,
    selectedItem
  } = params;
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem === suggestion.label;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected
          ? theme.typography.fontWeightMedium
          : theme.typography.fontWeightRegular
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square style={{ width: '100%', position: 'absolute' }}>
      {children}
    </Paper>
  );
}

function getSuggestions(inputValue) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase())) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

const styles = {
  container: {
    flexGrow: 1,
    height: 80,
    zIndex: 2
  },
  textField: {
    width: '100%'
  }
};

function TimezoneSelect(props) {
  const {
    classes,
    theme,
    timezone,
    blur
  } = props;

  return (
    <Downshift
      defaultInputValue={timezone}
      onSelect={(timezone) => {
        setTimeout(() => {
          blur('timezone', timezone);
        }, 50);
      }}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex
      }) => (
        <div className={classes.container} style={{ position: 'relative', zIndex: 2 }}>
          {
            renderInput(getInputProps({
              classes,
              id: 'integration-downshift'
            }))
          }
          {isOpen
            ? renderSuggestionsContainer({
              children: getSuggestions(inputValue).map((suggestion, index) =>
                renderSuggestion({
                  suggestion,
                  index,
                  theme,
                  itemProps: getItemProps({ item: suggestion.label }),
                  highlightedIndex,
                  selectedItem
                }))
            })
            : null}
        </div>
      )}
    />
  );
}

TimezoneSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  timezone: PropTypes.string.isRequired,
  blur: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(TimezoneSelect);
