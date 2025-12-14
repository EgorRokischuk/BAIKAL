import classNames from 'classnames';
import { InputHTMLAttributes, useId, useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import * as s from './FileInput.module.scss';

interface IFileInputProps extends InputHTMLAttributes<HTMLInputElement> {
        name: string;
        className?: string;
        label?: string;
}

export const FileInput: React.FC<IFileInputProps> = ({ name, className, label, multiple, ...props }) => {
        const inputId = useId();
        const [fileName, setFileName] = useState<string>('Файл не выбран');

        const { control } = useFormContext();
        const { field } = useController({ control, name });

        const controlLabel = useMemo(
                () => label ?? (multiple ? 'Загрузить файлы' : 'Загрузить файл'),
                [label, multiple],
        );

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const { files } = event.target;

                if (!files?.length) {
                        setFileName('Файл не выбран');
                        field.onChange(undefined);
                        return;
                }

                const value = multiple ? Array.from(files) : files[0];
                const name = multiple ? Array.from(files).map((file) => file.name).join(', ') : files[0].name;

                field.onChange(value);
                setFileName(name);
        };

        return (
                <div className={classNames(s.fileInput, className)}>
                        <label className={s.fileInput__button} htmlFor={inputId}>
                                {controlLabel}
                        </label>
                        <span className={s.fileInput__name}>{fileName}</span>
                        <input
                                id={inputId}
                                className={s.fileInput__native}
                                type="file"
                                multiple={multiple}
                                {...props}
                                onChange={handleChange}
                        />
                </div>
        );
};
