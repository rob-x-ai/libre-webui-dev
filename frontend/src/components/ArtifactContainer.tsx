/*
 * Libre WebUI
 * Copyright (C) 2025 Kroonen AI, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { ArtifactRenderer } from './ArtifactRenderer';
import { Artifact } from '@/types';
import { cn } from '@/utils';

interface ArtifactContainerProps {
  artifacts: Artifact[];
  className?: string;
}

export const ArtifactContainer: React.FC<ArtifactContainerProps> = ({
  artifacts,
  className,
}) => {
  const [fullscreenArtifact, setFullscreenArtifact] = useState<string | null>(
    null
  );

  if (!artifacts || artifacts.length === 0) {
    return null;
  }

  const handleFullscreenToggle = (artifactId: string) => {
    setFullscreenArtifact(
      fullscreenArtifact === artifactId ? null : artifactId
    );
  };

  return (
    <div className={cn('space-y-3', className)}>
      {artifacts.map(artifact => (
        <ArtifactRenderer
          key={artifact.id}
          artifact={artifact}
          isFullscreen={fullscreenArtifact === artifact.id}
          onFullscreenToggle={() => handleFullscreenToggle(artifact.id)}
        />
      ))}
    </div>
  );
};
