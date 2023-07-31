import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import React from 'react'
import { MdClose } from 'react-icons/md'
import { useChromeStorageSync } from 'use-chrome-storage'
import { handleBadgeAsync } from '../../listeners/background/handleBadge'
import { IRedirectItem } from '../../types/domains/redirect/IRedirectItem'
import { setSync } from '../../utils/chromeStoragePromises'
import { syncKeys } from '../../utils/syncKeys'
import { FlexCol } from '../_UI/boxes/FlexCol'
import { FlexVCenter } from '../_UI/boxes/FlexVCenter'

type Props = {}

const SiteRedirect = (props: Props) => {
  // @ts-expect-error
  const [isActive, setIsActive, isPersistent, error] = useChromeStorageSync(
    syncKeys.siteRedirect.isActive,
    false
  )

  // @ts-expect-error
  const [redirectItems, setRedirectItems]: [
    redirectItems: IRedirectItem[],
    setRedirectItems: (redirectItems: IRedirectItem[]) => void
  ] = useChromeStorageSync<IRedirectItem[]>(
    syncKeys.siteRedirect.redirectItems,
    []
  )

  const [urlInput, setUrlInput] = React.useState('')
  const [redirectInput, setRedirectInput] = React.useState('')

  const handleAdd = () => {
    const newRedirectItem: IRedirectItem = {
      uuid: Math.random().toString(36).substring(2, 15),
      urlIncludes: urlInput,
      redirectTo: redirectInput,
      addedAt: new Date().toISOString(),
    }

    setRedirectItems([...redirectItems, newRedirectItem])

    setUrlInput('')
    setRedirectInput('')
  }

  const handleRemove = (uuid: string) => {
    const newRedirectItems = redirectItems.filter(
      (redirectItem) => redirectItem.uuid !== uuid
    )
    setRedirectItems(newRedirectItems)
  }

  return (
    <Box>
      <FlexVCenter align={'center'} justify="space-between">
        <Title order={4}>Site Redirect</Title>
        <Switch
          color="secondary"
          label={isActive ? 'On' : 'Off'}
          checked={isActive}
          onChange={(event) => {
            const checked = event.currentTarget.checked

            setIsActive(checked)
            setSync(syncKeys.siteRedirect.isActive, checked)

            handleBadgeAsync()
          }}
        />
      </FlexVCenter>

      <FlexCol mt={8} gap={8}>
        <TextInput
          label="Url includes"
          value={urlInput}
          onChange={(event) => {
            setUrlInput(event.currentTarget.value)
          }}
        />
        <TextInput
          label="Redirect to"
          value={redirectInput}
          onChange={(event) => {
            setRedirectInput(event.currentTarget.value)
          }}
        />
        <Button onClick={handleAdd}>Add</Button>
      </FlexCol>

      <FlexCol mt={24}>
        {redirectItems.map((redirectItem) => {
          return (
            <Flex key={redirectItem.uuid} gap={8}>
              <ActionIcon
                onClick={() => handleRemove(redirectItem.uuid)}
                sx={(theme) => ({
                  ':hover': {
                    background: theme.colors.dark[3],
                  },
                })}
              >
                <MdClose />
              </ActionIcon>
              <Text>
                {redirectItem.urlIncludes} {'->'}{' '}
                <Text truncate title={redirectItem.redirectTo}>
                  {redirectItem.redirectTo}
                </Text>
              </Text>
            </Flex>
          )
        })}
      </FlexCol>
    </Box>
  )
}

export default SiteRedirect
