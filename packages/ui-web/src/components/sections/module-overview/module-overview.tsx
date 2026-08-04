import * as React from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/primitives/section';
import { Container } from '@/components/primitives/container';
import { Text } from '@/components/primitives/text';
import { SectionHeader } from '@/components/sections/section-header';
import styles from './module-overview.module.css';

export interface ModuleInfo {
  name: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

export interface ArchitectureLayer {
  name: string;
  modules: ModuleInfo[];
}

export interface ModuleOverviewProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  layers: ArchitectureLayer[];
}

export const ModuleOverview = React.forwardRef<HTMLElement, ModuleOverviewProps>(
  ({ eyebrow, title, subtitle, layers, ...props }, ref) => (
    // 旧既定の暗面を維持（構成図は暗面のほうが層の境界が読みやすい）
    <Section ref={ref} background="dark" spacing="lg" {...props}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className={styles.layers}>
          {layers.map((layer, i) => (
            <div key={i}>
              <div className={styles.layerName}>
                <Text as="div" size="caption" tone="muted">
                  {layer.name}
                </Text>
              </div>
              <div
                className={cn(
                  styles.modules,
                  layer.modules.length === 2 && styles.cols2,
                  layer.modules.length >= 3 && styles.cols3,
                )}
              >
                {layer.modules.map((mod, j) => (
                  <div key={j} className={styles.module}>
                    {mod.icon && <div className={styles.iconBox}>{mod.icon}</div>}
                    <div className={styles.moduleBody}>
                      <div className={styles.moduleHead}>
                        <span className={styles.moduleName}>
                          <Text as="span" size="body-sm" tone="brand">
                            {mod.name}
                          </Text>
                        </span>
                        <Text as="span" size="caption" tone="muted">
                          {mod.label}
                        </Text>
                      </div>
                      <div className={styles.moduleDescription}>
                        <Text size="caption" tone="secondary">
                          {mod.description}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* データフロー図 */}
        <div className={styles.flow}>
          <Text size="caption" tone="muted">
            Client → PolaGate → PolaStore / PolaFind / PolaLens
          </Text>
          <Text size="caption" tone="muted">
            PolaStore CDC → PolaCast / PolaFind / PolaLens
          </Text>
        </div>
      </Container>
    </Section>
  ),
);
ModuleOverview.displayName = 'ModuleOverview';
