import classNames from 'classnames';
import { InputHTMLAttributes, useEffect, useId, useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import * as s from './FileInput.module.scss';

interface IFileInputProps extends InputHTMLAttributes<HTMLInputElement> {
        name: string;
        className?: string;
        label?: string;
}

export const FileInput: React.FC<IFileInputProps> = ({ name, className, label, multiple, ...props }) => {
        const inputId = useId();

        const { control } = useFormContext();
        const { field } = useController({ control, name });

        const normalizeValue = (value: unknown): File[] => {
                if (!value) return [];
                if (Array.isArray(value)) return value as File[];
                return [value as File];
        };

        const [files, setFiles] = useState<File[]>(normalizeValue(field.value));

        useEffect(() => {
                setFiles(normalizeValue(field.value));
        }, [field.value]);

        const controlLabel = useMemo(
                () => label ?? (multiple ? 'Загрузить файлы' : 'Загрузить файл'),
                [label, multiple],
        );

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const { files: selectedFiles } = event.target;

                if (!selectedFiles?.length) {
                        setFiles([]);
                        field.onChange(undefined);
                        return;
                }

                const selected = Array.from(selectedFiles);
                const newValue = multiple ? [...files, ...selected] : selected[0];

                setFiles(multiple ? (newValue as File[]) : [newValue as File]);
                field.onChange(newValue);

                event.target.value = '';
        };

        const handleRemove = (index: number) => {
                const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index);
                setFiles(updatedFiles);
                if (!updatedFiles.length) {
                        field.onChange(undefined);
                        return;
                }

                field.onChange(multiple ? updatedFiles : updatedFiles[0]);
        };

        return (
                <div className={classNames(s.fileInput, className)}>
                        <div className={s.fileInput__controls}>
                                <label className={s.fileInput__button} htmlFor={inputId}>
                                        {controlLabel}
                                </label>
                                <input
                                        id={inputId}
                                        className={s.fileInput__native}
                                        type="file"
                                        multiple={multiple}
                                        {...props}
                                        onChange={handleChange}
                                />
                        </div>

                        <div className={s.fileInput__list}>
                                {files.length ? (
                                        files.map((file, index) => (
                                                <div className={s.fileInput__item} key={`${file.name}-${index}`}>
                                                        <span className={s.fileInput__name}>{file.name}</span>
                                                        <button
                                                                type="button"
                                                                className={s.fileInput__remove}
                                                                onClick={() => handleRemove(index)}
                                                                aria-label="Удалить файл"
                                                        >
                                                                ×
                                                        </button>
                                                </div>
                                        ))
                                ) : (
                                        <span className={s.fileInput__placeholder}>
                                                {multiple ? 'Файлы не выбраны' : 'Файл не выбран'}
                                        </span>
                                )}
                        </div>
                </div>
        );
};
