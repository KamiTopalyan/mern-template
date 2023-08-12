import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import IoMdArrowDropdown from "react-icons/io"

interface DropboxInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    options: string[],
    [x: string]: any,
}

const DropboxInputField = ({ name, label, register, registerOptions, error, options, ...props }: DropboxInputFieldProps) => {
    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            
            <Form.Label>{label}</Form.Label>
            <Form.Control as="select" defaultValue={options[0]} {...props} {...register(name, registerOptions)} >
            {options.map(option => (
                    <option value={option}>{option}</option>
            ))}
                
          </Form.Control>
        </Form.Group>
    );
}

export default DropboxInputField;
