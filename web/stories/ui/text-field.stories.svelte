<script context="module" lang="ts">
  import TextField from '../../ui/text-field.svelte'

  export const meta = {
    component: TextField,
    title: 'UI/TextField'
  }
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'

  import Card from '../../ui/card.svelte'
  import Paragraph from '../../ui/paragraph.svelte'
  import Section from '../section.svelte'

  let value = 'Value'
</script>

<Story name="Base">
  <Section width={500}>
    <Card>
      <TextField label="Base" required bind:value />
    </Card>
    <Paragraph>{value}</Paragraph>
  </Section>
  <Section width={500}>
    <Card>
      <TextField hideLabel label="Label" placeholder="Empty" value="" />
      <TextField hideLabel label="Label" placeholder="Another" value="" />
    </Card>
  </Section>
  <Section width={500}>
    <Card>
      <TextField error="The value is wrong" label="Wrong" value="Wrong" />
    </Card>
  </Section>
  <Section focus="input:first-of-type" width={500}>
    <Card>
      <TextField enterHint label="Focus" />
      <TextField label="Required" required value="" />
      <TextField enterHint label="Wrong URL" type="url" value="No a link" />
    </Card>
  </Section>
  <Section blur width={500}>
    <Card>
      <TextField label="Required and Blur" required value="" />
    </Card>
  </Section>
</Story>

<Story name="Dark" parameters={{ themes: { themeOverride: 'dark' } }}>
  <Section width={500}>
    <Card>
      <TextField label="Empty" bind:value />
      <Paragraph>{value}</Paragraph>
    </Card>
  </Section>
  <Section width={500}>
    <Card>
      <TextField label="Label" value="Text" />
    </Card>
  </Section>
  <Section width={500}>
    <Card>
      <TextField error="The value is wrong" label="Wrong" value="Wrong" />
    </Card>
  </Section>
  <Section focus width={500}>
    <Card>
      <TextField enterHint label="Focus" />
    </Card>
  </Section></Story
>
