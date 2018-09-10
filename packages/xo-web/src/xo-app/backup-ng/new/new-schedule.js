import _ from 'intl'
import React from 'react'
import Scheduler, { SchedulePreview } from 'scheduling'
import { Card, CardBlock } from 'card'
import { generateRandomId } from 'utils'
import { injectState, provideState } from '@julien-f/freactal'
import { Number } from 'form'

import { FormGroup, Input } from './../utils'

export default [
  provideState({
    initialState: () => ({
      formId: generateRandomId(),
      idInputName: generateRandomId(),
    }),
    effects: {
      setSchedule: (_, { name, value }) => (
        _,
        { value: schedule, onChange }
      ) => {
        onChange({
          ...schedule,
          [name]: value,
        })
      },
      setExportRetention: ({ setSchedule }, value) => () => {
        setSchedule({
          name: 'exportRetention',
          value,
        })
      },
      setCopyRetention: ({ setSchedule }, value) => () => {
        setSchedule({
          name: 'copyRetention',
          value,
        })
      },
      setSnapshotRetention: ({ setSchedule }, value) => () => {
        setSchedule({
          name: 'snapshotRetention',
          value,
        })
      },
      setCronTimezone: ({ setSchedule }, { cronPattern, timezone }) => () => {
        setSchedule({
          name: 'cron',
          value: cronPattern,
        }).then(() =>
          setSchedule({
            name: 'timezone',
            value: timezone,
          })
        )
      },
      setName: ({ setSchedule }, { target: { value } }) => () => {
        setSchedule({
          name: 'name',
          value: value.trim() === '' ? null : value,
        })
      },
    },
  }),
  injectState,
  ({
    effects,
    modes: { exportMode, copyMode, snapshotMode },
    state,
    value: schedule,
  }) => {
    const {
      copyRetention,
      cron,
      exportRetention,
      name,
      snapshotRetention,
      timezone,
    } = schedule

    return (
      <Card>
        <CardBlock>
          <FormGroup>
            <label htmlFor={state.idInputName}>
              <strong>{_('formName')}</strong>
            </label>
            <Input
              id={state.idInputName}
              onChange={effects.setName}
              value={name}
            />
          </FormGroup>
          {exportMode && (
            <FormGroup>
              <label>
                <strong>{_('scheduleExportRetention')}</strong>
              </label>
              <Number
                min='0'
                onChange={effects.setExportRetention}
                value={exportRetention}
              />
            </FormGroup>
          )}
          {copyMode && (
            <FormGroup>
              <label>
                <strong>{_('scheduleCopyRetention')}</strong>
              </label>
              <Number
                min='0'
                onChange={effects.setCopyRetention}
                value={copyRetention}
              />
            </FormGroup>
          )}
          {snapshotMode && (
            <FormGroup>
              <label>
                <strong>{_('snapshotRetention')}</strong>
              </label>
              <Number
                min='0'
                onChange={effects.setSnapshotRetention}
                value={snapshotRetention}
              />
            </FormGroup>
          )}
          <Scheduler
            onChange={effects.setCronTimezone}
            cronPattern={cron}
            timezone={timezone}
          />
          <SchedulePreview cronPattern={cron} timezone={timezone} />
        </CardBlock>
      </Card>
    )
  },
].reduceRight((value, decorator) => decorator(value))
