'use client';

import type { ReactNode } from 'react';

import {
  audioText,
  captionsText,
  playbackRateText,
  qualityText,
  settingsText,
  speedText,
} from '@videojs/core/i18n/text/menu';

import {
  CaptionsOffIcon,
  CheckIcon,
  GearIcon,
  QualityIcon,
  SeekIcon,
  SpeechIcon,
  SpeedIcon,
  SwitchesIcon,
} from '@videojs/react/icons';

import {
  AudioTrackRadioGroup,
  CaptionsRadioGroup,
  Menu,
  PlaybackRateRadioGroup,
  QualityRadioGroup,
  Tooltip,
  useAudioTrackOptions,
  useCaptionsOptions,
  usePlaybackRateOptions,
  useQualityOptions,
  useTranslator,
} from '@videojs/react';

import { Button } from './button';
import { MenuChevron } from './menu-chevron';
import { usePlayerPreferences } from '../player-preferences';

export function SettingsMenu(): ReactNode {
  const t = useTranslator();
  const { skipOpening, skipEnding, setPreferences } = usePlayerPreferences();

  const playbackRate = usePlaybackRateOptions();
  const quality = useQualityOptions();
  const audioTrack = useAudioTrackOptions();
  const captions = useCaptionsOptions();

  const hasPlaybackRate = playbackRate?.state.availability === 'available';

  const hasQuality = quality?.state.availability === 'available';

  const hasAudioTrack = audioTrack?.state.availability === 'available';

  const hasCaptions = captions?.state.availability === 'available';
  const hasFragments = true;

  if (!hasPlaybackRate && !hasQuality && !hasAudioTrack && !hasCaptions && !hasFragments) {
    return null;
  }

  return (
    <Menu.Root side="top" align="center">
      <Tooltip.Root side="top">
        <Tooltip.Trigger
          render={
            <Menu.Trigger
              aria-label={t(settingsText)}
              className="media-button--settings"
              render={<Button />}
            >
              <GearIcon className="media-icon media-icon--settings" />
            </Menu.Trigger>
          }
        />

        <Tooltip.Popup className="media-surface media-tooltip">
          <Tooltip.Label>{t(settingsText)}</Tooltip.Label>
        </Tooltip.Popup>
      </Tooltip.Root>

      <Menu.Content className="media-surface media-popover media-menu media-menu--settings">
        <div className="media-menu__group">
          <Menu.Root>
            <Menu.Trigger
              className="media-menu__item media-menu__item--submenu"
              render={(props) => (
                <div {...props}>
                  <SwitchesIcon className="media-icon" />

                  <span>Фрагменты</span>

                  <span className="media-menu__hint">
                    <MenuChevron />
                  </span>
                </div>
              )}
            />

            <Menu.Content className="media-menu__panel">
              <Menu.Item className="media-menu__back">
                <MenuChevron flipped />
                Фрагменты
              </Menu.Item>

              <Menu.Separator className="media-menu__separator" />

              <Menu.CheckboxItem
                checked={skipOpening}
                onCheckedChange={(checked) => setPreferences({ skipOpening: checked })}
                className="media-menu__item"
              >
                Пропускать опенинг
                <Menu.ItemIndicator
                  checked={skipOpening}
                  forceMount
                  className="media-menu__indicator"
                >
                  <CheckIcon className="media-icon" />
                </Menu.ItemIndicator>
              </Menu.CheckboxItem>

              <Menu.CheckboxItem
                checked={skipEnding}
                onCheckedChange={(checked) => setPreferences({ skipEnding: checked })}
                className="media-menu__item"
              >
                Пропускать эндинг
                <Menu.ItemIndicator
                  checked={skipEnding}
                  forceMount
                  className="media-menu__indicator"
                >
                  <CheckIcon className="media-icon" />
                </Menu.ItemIndicator>
              </Menu.CheckboxItem>
            </Menu.Content>
          </Menu.Root>
          {hasQuality ? (
            <Menu.Root>
              <Menu.Trigger
                className="media-menu__item media-menu__item--submenu"
                render={(props) => (
                  <div {...props}>
                    <QualityIcon className="media-icon" />

                    <span>{t(qualityText)}</span>

                    <span className="media-menu__hint">
                      <bdi dir="auto" className="media-menu__hint-label">
                        {quality.selectedLabel}
                      </bdi>

                      <MenuChevron />
                    </span>
                  </div>
                )}
              />

              <Menu.Content className="media-menu__panel">
                <Menu.Item className="media-menu__back">
                  <MenuChevron flipped />
                  {t(qualityText)}
                </Menu.Item>

                <Menu.Separator className="media-menu__separator" />

                <QualityRadioGroup
                  className="media-menu__group"
                  aria-label={t(qualityText)}
                  renderItem={(props, item) => (
                    <Menu.RadioItem {...props} className="media-menu__item">
                      <bdi dir="auto">
                        {item.label}

                        {item.tier ? <sup className="media-menu__tier">{item.tier}</sup> : null}
                      </bdi>

                      {item.badge ? <span className="media-badge">{item.badge}</span> : null}

                      <Menu.ItemIndicator
                        checked={item.checked}
                        forceMount
                        className="media-menu__indicator"
                      >
                        <CheckIcon className="media-icon" />
                      </Menu.ItemIndicator>
                    </Menu.RadioItem>
                  )}
                />
              </Menu.Content>
            </Menu.Root>
          ) : null}

          {hasAudioTrack ? (
            <Menu.Root>
              <Menu.Trigger
                className="media-menu__item media-menu__item--submenu"
                render={(props) => (
                  <div {...props}>
                    <SpeechIcon className="media-icon" />

                    <span>{t(audioText)}</span>

                    <span className="media-menu__hint">
                      <bdi dir="auto" className="media-menu__hint-label">
                        {audioTrack.selectedLabel}
                      </bdi>

                      <MenuChevron />
                    </span>
                  </div>
                )}
              />

              <Menu.Content className="media-menu__panel">
                <Menu.Item className="media-menu__back">
                  <MenuChevron flipped />
                  {t(audioText)}
                </Menu.Item>

                <Menu.Separator className="media-menu__separator" />

                <AudioTrackRadioGroup
                  className="media-menu__group"
                  aria-label={t(audioText)}
                  renderItem={(props, item) => (
                    <Menu.RadioItem {...props} className="media-menu__item">
                      <bdi dir="auto">{item.label}</bdi>

                      <Menu.ItemIndicator
                        checked={item.checked}
                        forceMount
                        className="media-menu__indicator"
                      >
                        <CheckIcon className="media-icon" />
                      </Menu.ItemIndicator>
                    </Menu.RadioItem>
                  )}
                />
              </Menu.Content>
            </Menu.Root>
          ) : null}

          {hasPlaybackRate ? (
            <Menu.Root>
              <Menu.Trigger
                className="media-menu__item media-menu__item--submenu"
                render={(props) => (
                  <div {...props}>
                    <SpeedIcon className="media-icon" />

                    <span>{t(speedText)}</span>

                    <span className="media-menu__hint">
                      <bdi dir="auto" className="media-menu__hint-label">
                        {playbackRate.selectedLabel}
                      </bdi>

                      <MenuChevron />
                    </span>
                  </div>
                )}
              />

              <Menu.Content className="media-menu__panel">
                <Menu.Item className="media-menu__back">
                  <MenuChevron flipped />
                  {t(speedText)}
                </Menu.Item>

                <Menu.Separator className="media-menu__separator" />

                <PlaybackRateRadioGroup
                  className="media-menu__group"
                  aria-label={t(playbackRateText)}
                  renderItem={(props, item) => (
                    <Menu.RadioItem {...props} className="media-menu__item">
                      <bdi dir="auto">{item.label}</bdi>

                      <Menu.ItemIndicator
                        checked={item.checked}
                        forceMount
                        className="media-menu__indicator"
                      >
                        <CheckIcon className="media-icon" />
                      </Menu.ItemIndicator>
                    </Menu.RadioItem>
                  )}
                />
              </Menu.Content>
            </Menu.Root>
          ) : null}

          {hasCaptions ? (
            <Menu.Root>
              <Menu.Trigger
                className="media-menu__item media-menu__item--submenu"
                render={(props) => (
                  <div {...props}>
                    <CaptionsOffIcon className="media-icon" />

                    <span>{t(captionsText)}</span>

                    <span className="media-menu__hint">
                      <bdi dir="auto" className="media-menu__hint-label">
                        {captions.selectedLabel}
                      </bdi>

                      <MenuChevron />
                    </span>
                  </div>
                )}
              />

              <Menu.Content className="media-menu__panel">
                <Menu.Item className="media-menu__back">
                  <MenuChevron flipped />
                  {t(captionsText)}
                </Menu.Item>

                <Menu.Separator className="media-menu__separator" />

                <CaptionsRadioGroup
                  className="media-menu__group"
                  aria-label={t(captionsText)}
                  renderItem={(props, item) => (
                    <Menu.RadioItem {...props} className="media-menu__item">
                      <bdi dir="auto">{item.label}</bdi>

                      <Menu.ItemIndicator
                        checked={item.checked}
                        forceMount
                        className="media-menu__indicator"
                      >
                        <CheckIcon className="media-icon" />
                      </Menu.ItemIndicator>
                    </Menu.RadioItem>
                  )}
                />
              </Menu.Content>
            </Menu.Root>
          ) : null}
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}
