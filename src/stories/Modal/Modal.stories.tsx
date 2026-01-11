import { Button } from '@/shared/ui';
import { Modal, ModalProps } from '@/shared/ui/modal/Modal';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

const meta = {
  component: Modal,
  title: 'Components/Modal',
} satisfies Meta<typeof Modal>;

export default meta;

function Render(args: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant={'primary'} onClick={openHandler}>
        ShowModal
      </Button>
      <Modal
        size={args.size}
        open={isOpen}
        onClose={closeHandler}
        title={args.title}
        showCloseButton={args.showCloseButton}
      >
        {args.children}
      </Modal>
    </>
  );
}

type Story = StoryObj<typeof Modal>;

export const SmallModal: Story = {
  args: {
    size: 'sm',
    title: 'Small',
    showCloseButton: true,
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto,
        veritatis!
      </div>
    ),
  },
  render: Render,
};

export const MediumModal: Story = {
  args: {
    size: 'md',
    title: 'Medium',
    showCloseButton: true,
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto,
        veritatis!
      </div>
    ),
  },
  render: Render,
};

export const LargeModal: Story = {
  args: {
    size: 'lg',
    title: 'Large',
    showCloseButton: true,
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto,
        veritatis!
      </div>
    ),
  },
  render: Render,
};
