import styled from 'styled-components';
import {FieldError as ReactHookFormFeildError} from 'react-hook-form';

type FormFieldProps = {
  children: React.ReactNode;
  hasError?: ReactHookFormFeildError;
  altstyle?: boolean;
};

type SelectProps = {
  options: {value: string; label: string}[];
  onChange: (value: string) => void;
  value?: string;
};

const Container = styled.form.attrs({autoComplete: 'off'})<FormFieldProps>`
  display: flex;
  flex-direction: column;
  width: ${({altstyle}) => (altstyle ? '' : '35rem')};
  margin: ${({altstyle}) => (altstyle ? '' : '')};
`;

const FormField = styled.div<FormFieldProps>`
  margin: 0.8rem 0;

  label {
    color: var(--black, #191d23);
    font-size: 13.5px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
  .react-international-phone-country-selector-button {
    padding: 17px 12px;
    height: 54px;
    border-right: none;
  }
  .react-international-phone-input {
    padding: 17px 12px;
    height: 54px;
  }

  input,
  select,
  textarea {
    border-width: 1px;
    border-style: solid;
    border-color: ${({hasError}) =>
      hasError ? 'var(--error-color)' : 'var(--input-border)'};
    border-radius: 5px;
    color: inherit;
    padding: 7px 16px;
    outline: 0;
    font-family: inherit;
    font-size: 12px;
    font-weight: 400;
    width: 100%;

    &:focus {
      border-color: var(--primary-color);
    }

    &:focus + label {
      color: var(--primary-color);
    }

    &::placeholder {
      color: #928fa6;
      font-weight: 400;
      font-size: 12px;
    }
  }

  textarea {
    height: 87px;
  }

  input.createform,
  select.createform {
    padding: 5px 16px !important;
  }

  input.image::-webkit-file-upload-button,
  input.image::-webkit-file-upload-button {
    display: none;
  }

  input.image {
    border-radius: 5px;
    border: 0.5px solid #000;
    height: 150px !important;
  }

  & select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('/portal/icons/down-arrow.svg');
    background-repeat: no-repeat;
    background-position: right;
    background-size: 2rem;
    cursor: pointer;
    text-transform: capitalize;
  }
`;

const FormFieldAlt = styled.div<FormFieldProps>`
  margin: 1rem 0rem 1.7rem 0rem;

  label {
    color: var(--text-color);
    font-size: 12px;
    font-style: normal;
    font-weight: 530;
    line-height: 24px;
    align-self: center;
  }

  input,
  select,
  textarea {
    border-width: 1px;
    border-style: solid;
    border-color: #848484;
    border-radius: 5px;
    color: inherit;
    padding: 7px 16px;
    outline: 0;
    font-family: inherit;
    font-size: 12px;
    font-weight: 400;
    width: 100%;

    &:focus {
      border-color: var(--primary-color);
    }

    &:focus + label {
      color: var(--primary-color);
    }

    &::placeholder {
      color: #928fa6;
      font-weight: 400;
      font-size: 11px;
    }
  }

  textarea {
    min-height: 76px;
  }

  & select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: url(./portal/icons/mdi_chevron-down.svg) 95% / 7% no-repeat #fff;
  }
`;

const FieldError = styled.p.attrs({role: 'alert'})`
  color: #e40e40;
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 0.4rem;
  text-align: left;
`;

const FormFieldContainer = styled.div<FormFieldProps>`
  display: grid;
  align-items: center;
`;

const ErrorContainer = styled.div<FormFieldProps>`
  display: grid;
  text-align: right;
  margin-top: 0.2rem;
`;

const Field: React.FC<FormFieldProps> = ({children, hasError, altstyle}) => {
  const StyledField = altstyle ? FormFieldAlt : FormField;

  return (
    <StyledField hasError={hasError}>
      <FormFieldContainer
        style={altstyle ? {gridTemplateColumns: '130px 1fr'} : {}}>
        {children}
      </FormFieldContainer>

      {hasError && (
        <ErrorContainer style={altstyle ? {marginLeft: '130px'} : {}}>
          <FieldError>{hasError.message}</FieldError>
        </ErrorContainer>
      )}
    </StyledField>
  );
};

const Select: React.FC<SelectProps> = (props) => {
  return (
    <select
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
      value={props.value}>
      <option value="">Select Option</option>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const ImageInput = styled.label<FormFieldProps>`
  border-radius: 5px;
  border: 0.5px solid #000;
  max-width: 90px;
  height: ${({altstyle}) =>
    altstyle ? '90px !important' : '127px !important'};
  flex-shrink: 0;
  cursor: pointer;
  object-fit: fill;
`;

const CoverImageInput = styled.label<FormFieldProps>`
  border-radius: 5px;
  border: 0.5px solid #000;
  max-width: 280px;
  min-height: ${({altstyle}) =>
    altstyle ? '50px !important' : '120px !important'};
  width: auto;
  height: auto;
  flex-shrink: 0;
  cursor: pointer;
  object-fit: cover;
  position: center;
`;

const BrandColor = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--input-border);
  border-radius: 5px;
  outline: 0;
  font-family: inherit;
  font-size: 11px;
  font-weight: 400;
  width: 100%;

  .color-picker {
    width: 50% !important;
    border: none;
    padding: unset;
    outline: none;
  }

  .color-preview {
    display: flex;
    text-align: center;
    margin-left: 68px;
    height: 100%;
    background-color: var(--default-color);
    border-radius: 0 5px 5px 0;
    align-items: center;
  }
`;

const Subtext = styled.div<FormFieldProps>`
  font-size: 9px;
  color: #928fa6;
  margin-top: ${({hasError}) =>
    hasError ? '-41px !important' : '-10px !important'};
  text-align: right;
`;

export {
  Container,
  Field,
  Select,
  ImageInput,
  CoverImageInput,
  BrandColor,
  Subtext,
};
