import React from 'react';
import {
	Modal,
	ModalContent,
	ModalTitle,
	ModalTrigger,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';

import { MagnifyingGlass } from 'phosphor-react';
import type { IconProps } from 'phosphor-react';
import { cn } from '@/lib/utils';

export type CommandItemType = {
	id: string;
	title: string;
	description: string;
	category: string;
	icon?: React.ComponentType<IconProps>;
	shortcut?: string;
	onClick?: () => void;
};

type SearchModalProps = {
	children: React.ReactNode;
	data: CommandItemType[];
};

export function SearchModal({ children, data }: SearchModalProps) {
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState('');

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<Modal open={open} onOpenChange={setOpen}>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="p-1">
				<ModalTitle className="sr-only">Search</ModalTitle>
				<Command className="bg-background md:bg-card rounded-md md:border">
					<CommandInput
						className={cn(
							'placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
						)}
						placeholder="Search perfumes..."
						value={query}
						onValueChange={setQuery}
					/>
					<CommandList className="max-h-[380px] min-h-[380px] px-2 md:px-0">
						<CommandEmpty className="flex min-h-[280px] flex-col items-center justify-center">
							<MagnifyingGlass size={24} weight="light" className="text-muted-foreground mb-2" />
							<p className="text-muted-foreground mb-1 text-xs">
								No products found for "{query}"
							</p>
							<Button onClick={() => setQuery('')} variant="ghost">
								Clear search
							</Button>
						</CommandEmpty>
						<CommandGroup>
							{data.map((item, i) => {
								return (
									<CommandItem
										key={i}
										className="flex cursor-pointer items-center gap-3"
										value={item.title}
										onSelect={() => {
											if (item.onClick) {
												item.onClick();
											}
											setOpen(false);
										}}
									>
										{item.icon && <item.icon size={20} weight="light" />}
										<div className="flex flex-col flex-1 min-w-0">
											<p className="truncate text-sm font-medium">
												{item.title}
											</p>
											<p className="text-muted-foreground text-xs truncate">
												{item.description}
											</p>
										</div>
										<p className="text-muted-foreground ml-auto text-xs whitespace-nowrap">
											{item.category}
										</p>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</ModalContent>
		</Modal>
	);
}
