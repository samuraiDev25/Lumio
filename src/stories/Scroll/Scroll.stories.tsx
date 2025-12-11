import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Scroll } from '@/shared/ui';

const meta = {
  component: Scroll,
  title: 'Scrollbar',
} satisfies Meta<typeof Scroll>;

export default meta;

type Stories = StoryObj<typeof Scroll>;

export const BaseScrollbar: Stories = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, doloremque, sed! Aspernatur corporis ducimus, et optio quaerat repudiandae veniam. Accusamus amet facilis ipsa itaque saepe tenetur! A accusantium aperiam architecto consequuntur deserunt dicta, exercitationem ipsam maxime minima molestiae mollitia nam nihil numquam odio officia perferendis porro quae quam quia quis rem repellendus sed soluta sunt veritatis. Ab adipisci aliquam dolor ipsa laborum libero necessitatibus praesentium provident quasi quibusdam saepe, totam? Aliquid asperiores illo, iure reprehenderit sed soluta! Beatae cumque cupiditate delectus, dolore error eum hic illum incidunt minus nemo repudiandae voluptates. Adipisci aut, fuga natus obcaecati quasi rem ullam! Praesentium!',
    maxWidth: 200,
    maxHeight: 200,
    type: 'auto',
  },
  render: (args) => {
    return (
      <div
        style={{
          padding: '10px',
          border: '2px solid var(--color-light-100)',
          height: 'fit-content',
          width: 'fit-content',
          color: '--color-light-100',
        }}
      >
        <Scroll
          maxWidth={args.maxWidth}
          maxHeight={args.maxHeight}
          type={args.type}
        >
          {args.children}
        </Scroll>
      </div>
    );
  },
};
