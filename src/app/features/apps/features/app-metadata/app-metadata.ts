import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import {
  form,
  FormField,
  submit,
  validateStandardSchema,
} from '@angular/forms/signals';
import { HlmButtonImports } from '@neotic/helm/button';
import { HlmCollapsibleImports } from '@neotic/helm/collapsible';
import { HlmFieldImports } from '@neotic/helm/field';
import { HlmInputImports } from '@neotic/helm/input';
import { HlmTextareaImports } from '@neotic/helm/textarea';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import {
  ApplicationMetadata,
  appMetadataSchema,
} from '../../../../shared/models/app.schema';
import { AppService } from '../../../../shared/services/app-service';

@Component({
  imports: [
    FormField,
    HlmButtonImports,
    HlmCollapsibleImports,
    HlmFieldImports,
    HlmInputImports,
    HlmTextareaImports,
    NgIcon,
  ],
  providers: [provideIcons({ lucideChevronRight })],
  selector: 'app-app-metadata',
  styles: ``,
  template: `
    <div class="flex h-full w-full flex-col">
      <div
        class="border-border flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3">
        <h2
          class="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          App Settings
        </h2>
        <span class="text-muted-foreground min-w-0 truncate text-xs">
          {{ _appService.activeApp().metadata.name }}
        </span>
      </div>

      <form
        class="flex min-h-0 flex-1 flex-col"
        novalidate
        (submit)="save($event)">
        <div class="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
          <div hlmField>
            <label hlmFieldLabel for="app-name">App Name</label>
            <input
              hlmInput
              id="app-name"
              autocomplete="off"
              [formField]="metadataForm.name" />
            @if (metadataForm.name().touched()) {
              @for (error of metadataForm.name().errors(); track error) {
                <hlm-field-error class="text-xs">
                  {{ error.message }}
                </hlm-field-error>
              }
            }
          </div>

          <div hlmField>
            <label hlmFieldLabel for="app-slug">Slug</label>
            <input
              hlmInput
              id="app-slug"
              autocomplete="off"
              [formField]="metadataForm.slug" />
            <p hlmFieldDescription class="text-xs">
              Used as a URL-safe identifier. Lowercase letters, numbers, and
              hyphens only.
            </p>
            @if (metadataForm.slug().touched()) {
              @for (error of metadataForm.slug().errors(); track error) {
                <hlm-field-error>{{ error.message }}</hlm-field-error>
              }
            }
          </div>

          <div hlmField>
            <label hlmFieldLabel for="app-description">
              Description
              <span class="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </label>
            <textarea
              hlmTextarea
              id="app-description"
              rows="3"
              placeholder="A brief description of your app"
              [formField]="metadataForm.description"></textarea>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="app-version">Version</label>
            <input
              hlmInput
              id="app-version"
              autocomplete="off"
              [formField]="metadataForm.version" />
            <p hlmFieldDescription class="text-xs">
              Version of the generated app. Bumped when you export.
            </p>
            @if (metadataForm.version().touched()) {
              @for (error of metadataForm.version().errors(); track error) {
                <hlm-field-error>{{ error.message }}</hlm-field-error>
              }
            }
          </div>

          <div
            hlmCollapsible
            class="flex flex-col gap-3"
            [expanded]="advancedOpen()"
            (expandedChange)="advancedOpen.set($event)">
            <button
              hlmCollapsibleTrigger
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center gap-1 self-start rounded-md text-xs font-semibold tracking-wide uppercase outline-none focus-visible:ring-2">
              <ng-icon
                hlm
                name="lucideChevronRight"
                aria-hidden="true"
                class="text-sm transition-transform"
                [class.rotate-90]="advancedOpen()" />
              Advanced
            </button>

            <div hlmCollapsibleContent>
              <div hlmField>
                <label hlmFieldLabel for="app-prefix">Component Prefix</label>
                <input
                  hlmInput
                  id="app-prefix"
                  autocomplete="off"
                  [formField]="metadataForm.prefix" />
                <p hlmFieldDescription class="text-xs">
                  Angular component selector prefix (e.g.
                  {{ model().prefix }} &rarr; &lt;{{
                    model().prefix
                  }}-header&gt;). Changing it later doesn't rename components
                  you already generated.
                </p>
                @if (metadataForm.prefix().touched()) {
                  @for (error of metadataForm.prefix().errors(); track error) {
                    <hlm-field-error>{{ error.message }}</hlm-field-error>
                  }
                }
              </div>
            </div>
          </div>
        </div>

        <div
          class="border-border flex shrink-0 flex-wrap justify-end gap-2 border-t p-3">
          <button
            hlmBtn
            type="button"
            variant="outline"
            [disabled]="!isChanged()"
            (click)="reset()">
            Reset
          </button>
          <button hlmBtn type="submit" [disabled]="!isChanged()">Save</button>
        </div>
      </form>
    </div>
  `,
})
export default class AppMetadata {
  protected readonly _appService = inject(AppService);

  protected readonly advancedOpen = signal(false);

  // last saved values
  private readonly _saved = computed<ApplicationMetadata>(() => ({
    ...this._appService.activeApp().metadata,
  }));

  // reset the form only when the active app changes, not on every save
  protected readonly model = linkedSignal<string, ApplicationMetadata>({
    source: () => this._appService.activeApp().id,
    computation: () => untracked(() => this._saved()),
  });

  protected readonly isChanged = computed(() => {
    const value = this.model();
    const saved = this._saved();
    return (Object.keys(saved) as (keyof ApplicationMetadata)[]).some(
      key => value[key] !== saved[key],
    );
  });

  protected readonly metadataForm = form(this.model, path => {
    validateStandardSchema(path, appMetadataSchema);
  });

  protected async save(event: Event): Promise<void> {
    event.preventDefault();

    // submit() marks every field touched and only runs the action when valid
    const saved = await submit(this.metadataForm, async () => {
      // parse to apply the schema's trimming before saving
      const data = appMetadataSchema.parse(this.model());
      this._appService.updateActiveAppMetadata(data);
      this.metadataForm().reset(data);
      toast.success('App settings saved');
      return undefined;
    });

    // errors inside the collapsed section would otherwise stay hidden
    if (!saved && this.metadataForm.prefix().invalid()) {
      this.advancedOpen.set(true);
    }
  }

  protected reset(): void {
    this.metadataForm().reset(this._saved());
  }
}
