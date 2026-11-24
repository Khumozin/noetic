import {
  Component,
  computed,
  inject,
  linkedSignal,
  untracked,
} from '@angular/core';
import {
  form,
  FormField,
  submit,
  validateStandardSchema,
} from '@angular/forms/signals';
import { HlmButtonImports } from '@neotic/helm/button';
import { HlmFieldImports } from '@neotic/helm/field';
import { HlmInputImports } from '@neotic/helm/input';
import { HlmSelectImports } from '@neotic/helm/select';
import { toast } from '@spartan-ng/brain/sonner';
import {
  PageMetadata,
  pageMetadataSchema,
  PageType,
  pageTypeSchema,
} from '../../../../shared/models/page.schema';
import { PagesService } from '../../../../shared/services/pages-service';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// derived from the schema so a new page type only needs adding there
const PAGE_TYPES: { value: PageType; label: string }[] =
  pageTypeSchema.options.map(value => ({ value, label: capitalize(value) }));

const EMPTY_PAGE: PageMetadata = {
  name: '',
  slug: '',
  type: 'form',
  title: '',
};

@Component({
  imports: [
    FormField,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
    HlmSelectImports,
  ],
  selector: 'app-page-detail',
  styles: ``,
  template: `
    <div class="flex h-full w-full flex-col">
      <div
        class="border-border flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3">
        <h2
          class="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Page Settings
        </h2>
        @if (_pagesService.activePage(); as page) {
          <span class="text-muted-foreground min-w-0 truncate text-xs">
            {{ page.name }}
          </span>
        }
      </div>

      @if (_pagesService.activePage(); as page) {
        <form
          class="flex min-h-0 flex-1 flex-col"
          novalidate
          (submit)="save($event)">
          <div class="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
            <div hlmField>
              <label hlmFieldLabel for="page-name">Page Name</label>
              <input
                hlmInput
                id="page-name"
                autocomplete="off"
                [formField]="pageForm.name" />
              @if (pageForm.name().touched()) {
                @for (error of pageForm.name().errors(); track error) {
                  <hlm-field-error class="text-xs">
                    {{ error.message }}
                  </hlm-field-error>
                }
              }
            </div>

            <div hlmField>
              <label hlmFieldLabel for="page-slug">Slug</label>
              <input
                hlmInput
                id="page-slug"
                autocomplete="off"
                [formField]="pageForm.slug" />
              <p hlmFieldDescription class="text-xs">
                Used as the page's URL path segment.
              </p>
              @if (pageForm.slug().touched()) {
                @for (error of pageForm.slug().errors(); track error) {
                  <hlm-field-error>{{ error.message }}</hlm-field-error>
                }
              }
            </div>

            <div hlmField>
              <label hlmFieldLabel for="page-title">
                Title
                <span class="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </label>
              <input
                hlmInput
                id="page-title"
                autocomplete="off"
                placeholder="Shown at the top of the page"
                [formField]="pageForm.title" />
            </div>

            <div hlmField>
              <label hlmFieldLabel for="page-type">Page Type</label>
              <hlm-select
                [formField]="pageForm.type"
                [itemToString]="pageTypeLabel">
                <hlm-select-trigger buttonId="page-type" class="w-full">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content *hlmSelectPortal>
                  @for (option of pageTypes; track option.value) {
                    <hlm-select-item [value]="option.value">
                      {{ option.label }}
                    </hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
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
      } @else {
        <div
          class="text-muted-foreground flex flex-1 items-center justify-center p-3 text-center text-xs">
          Select a page to edit its settings.
        </div>
      }
    </div>
  `,
})
export default class PageDetail {
  protected readonly _pagesService = inject(PagesService);

  protected readonly pageTypes = PAGE_TYPES;

  // last saved values for the selected page
  private readonly _saved = computed<PageMetadata>(() => {
    const page = this._pagesService.activePage();
    if (!page) return EMPTY_PAGE;
    const { name, slug, type, title } = page;
    return { name, slug, type, title };
  });

  // reset the form only when the selected page changes, not on every save
  protected readonly model = linkedSignal<string | undefined, PageMetadata>({
    source: () => this._pagesService.activePage()?.id,
    computation: () => untracked(() => this._saved()),
  });

  protected readonly isChanged = computed(() => {
    const value = this.model();
    const saved = this._saved();
    return (Object.keys(saved) as (keyof PageMetadata)[]).some(
      key => value[key] !== saved[key],
    );
  });

  protected readonly pageForm = form(this.model, path => {
    validateStandardSchema(path, pageMetadataSchema);
  });

  protected readonly pageTypeLabel = (value: PageType) => capitalize(value);

  protected async save(event: Event): Promise<void> {
    event.preventDefault();

    const page = this._pagesService.activePage();
    if (!page) return;

    // submit() marks every field touched and only runs the action when valid
    await submit(this.pageForm, async () => {
      // parse to apply the schema's trimming before saving
      const data = pageMetadataSchema.parse(this.model());
      this._pagesService.updatePage(page.id, data);
      this.pageForm().reset(data);
      toast.success('Page settings saved');
      return undefined;
    });
  }

  protected reset(): void {
    this.pageForm().reset(this._saved());
  }
}
