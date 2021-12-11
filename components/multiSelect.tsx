import Multiselect from 'multiselect-react-dropdown';
import { useEffect, useState } from 'react';

export default function Filter({
	options,
	onSelect,
	onRemove,
	placeholder,
}: {
	options: Array<string>;
	onSelect: (selectedList: Array<string>, selectedItem: string) => void;
	onRemove: (selectedList: Array<string>, selectedItem: string) => void;
	placeholder: string;
}) {
	useEffect(() => {}, [placeholder]);
	// TODO: enable select all option by modifying module src https://github.com/srigar/multiselect-react-dropdown/blob/master/src/multiselect/multiselect.component.tsx
	// select all logic https://codesandbox.io/s/react-multi-select-checkboxes-iz34q?file=/src/MultiSelectAll.js
	return (
		<Multiselect
			options={options}
			isObject={false}
			placeholder={placeholder}
			onSelect={onSelect}
			onRemove={onRemove}
			selectedValues={options}
			showCheckbox
			closeOnSelect={false}
			style={{
				chips: {
					display: 'none',
				},
			}}
		/>
	);
}
